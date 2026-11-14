# Device testing: emulators, simulators and a consistent test environment

Everything below is written against **this repo** and **this machine** (macOS,
Apple Silicon). The commands are the ones that were actually run here, so they
should work for you as-is.

---

## 1. Why the browser is not enough

`npx expo start --web` renders the same React Native code through
`react-native-web`. It is a fast loop for layout work, but it is **not** the
platform, and it hides a whole class of bugs:

| Web preview | Native device |
| --- | --- |
| `box-shadow` renders as a real shadow | Android draws `elevation`, iOS draws its own shadow - the two do not match |
| No status bar, no home indicator, no gesture bar | Insets move the content, and `StatusBar` has to be styled per screen |
| No system back gesture or back button | Android's back button and iOS's edge swipe both need handling |
| No soft keyboard | `KeyboardAvoidingView` / `adjustResize` behaviour only shows up native |
| `elevation` is ignored | Shadow-less surfaces on Android need `elevation`, and elevation has a Material look |
| Text metrics come from the browser's fonts | The device's font, font scale and line-height rounding differ |
| Absolute positioning behaves like the browser | Native yoga rounds and clips differently, and overflow shows up as a cut-off card |

That is not theoretical: this session found a clipped banner tile, a
two-column product grid and a ragged category grid **only** because the design
was drawn on a fixed 393pt / 412dp canvas. The web preview showed them
correctly at 412dp.

**Rule of thumb:** the web preview is for iterating. The emulator (or a real
device) is for signing off.

---

## 2. What is already on this machine

```
~/Library/Android/sdk
├── emulator/            37.2.12
├── platform-tools/      37.0.0     (adb)
├── cmdline-tools/       latest      (sdkmanager, avdmanager)
├── build-tools/         34, 36, 37
├── platforms/           android-34, android-37.0
├── ndk/                 26.1.10909125, 27.1.12297006
└── system-images/android-34/google_apis/arm64-v8a

~/.android/avd/medmate.avd    1080x2400 @ 420dpi  ->  411 x 914 dp
```

The AVD is already running headless on `emulator-5554`.

**There is no Xcode on this machine** - only the Command Line Tools:

```
$ xcodebuild -version
xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer
directory '/Library/Developer/CommandLineTools' is a command line tools instance
```

So **iOS can only be signed off on a Mac with Xcode installed**, or through
TestFlight / EAS Device Builds. Everything iOS in this guide is written for
that machine.

---

## 3. Android emulator

### 3.1 Requirements

| Need | Why | Here |
| --- | --- | --- |
| macOS 13+ on Apple Silicon, or Windows 11 / Linux x86_64 | The emulator needs a hypervisor | macOS 15, Apple Silicon |
| 8 GB RAM free, 25 GB disk | One AVD with a system image is ~8 GB | 192 GB free |
| JDK 17 | `sdkmanager`, `avdmanager` and Gradle all need it | `brew install openjdk@17` |
| Android SDK cmdline-tools | To install images and build AVDs | Present |
| ARM64 system image | Native speed on Apple Silicon | `android-34;google_apis;arm64-v8a` installed |

> **`java` on PATH is a stub.** `/usr/bin/java` exists but errors with
> "Unable to locate a Java Runtime". Always set the path explicitly:
> ```bash
> export JAVA_HOME=/opt/homebrew/opt/openjdk@17
> export PATH="$JAVA_HOME/bin:$PATH"
> ```

### 3.2 Create the device matrix

The Figma frames are drawn on two canvases, so test those two first, then the
narrower phones where fixed-width layouts break.

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

# 411 x 914 dp - matches the Android design canvas (412 dp)
avdmanager create avd -n medmate-pixel -k "system-images;android-34;google_apis;arm64-v8a" -d pixel_6 --force

# 360 x 800 dp - the most common budget Android width
avdmanager create avd -n medmate-360 -k "system-images;android-34;google_apis;arm64-v8a" -d pixel_4 --force

# 320 x 693 dp - the narrow edge case that breaks four-across grids
avdmanager create avd -n medmate-320 -k "system-images;android-34;google_apis;arm64-v8a" -d pixel_2 --force

emulator -list-avds
```

To change the size of an existing AVD, edit `~/.android/avd/<name>.avd/config.ini`:

```ini
hw.lcd.width=1080
hw.lcd.height=2400
hw.lcd.density=420      # 1080/420*160 = 411 dp wide
hw.ramSize=2048
```

### 3.3 Boot headless (for CI and for screenshots)

```bash
~/Library/Android/sdk/emulator/emulator \
  -avd medmate -no-window -no-audio -no-boot-anim -no-snapshot \
  -gpu swiftshader_indirect -memory 2048 &

# wait for it to be really up (not just "device")
until [ "$(~/Library/Android/sdk/platform-tools/adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ]; do sleep 5; done
~/Library/Android/sdk/platform-tools/adb devices
```

`-gpu swiftshader_indirect` is software rendering: slower, but it works
headless and it renders identically on CI. Drop it for interactive use.

### 3.4 Install, launch, capture

```bash
ADB=~/Library/Android/sdk/platform-tools/adb

$ADB install -r /Users/rey/Downloads/MedMate.apk
$ADB shell monkey -p in.medmate.customer -c android.intent.category.LAUNCHER 1
sleep 10
$ADB exec-out screencap -p > /tmp/home.png          # PNG straight to disk

$ADB shell input tap 540 900                        # tap
$ADB shell input swipe 540 1800 540 600 300        # scroll
$ADB shell input text "paracetamol"                # type
$ADB shell input keyevent 4                        # back
$ADB logcat -d ReactNativeJS:V ReactNative:V *:S  # app logs
$ADB shell pm clear in.medmate.customer            # wipe app data
```

### 3.5 The dev server

The emulator reaches the host at `10.0.2.2`, but the simplest route is to
reverse the port:

```bash
$ADB reverse tcp:8081 tcp:8081     # Metro
$ADB reverse tcp:19000 tcp:19000   # dev client / inspector
```

Then `cd apps/mobile && npx expo start` and open the app. A **release** build
(`assembleRelease`) is what you install for sign-off; a debug build talks to
Metro and will not show the bundle you just changed.

---

## 4. iOS Simulator (on a Mac with Xcode)

```bash
xcode-select --install          # only the command line tools - not enough
# Install Xcode 16+ from the App Store, then:
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcodebuild -runFirstLaunch

xcodebuild -downloadPlatform iOS   # the simulator runtime is a separate download
xcrun simctl list devices available
```

Create and boot a simulator that matches the iOS design canvas:

```bash
xcrun simctl create "MedMate iPhone 15" \
  "com.apple.CoreSimulator.SimDeviceType.iPhone-15" \
  "com.apple.CoreSimulator.SimRuntime.iOS-18-0"

xcrun simctl boot "MedMate iPhone 15"
open -a Simulator
```

Drive it:

```bash
xcrun simctl install booted /path/to/MedMate.app
xcrun simctl launch booted in.medmate.customer
xcrun simctl io booted screenshot /tmp/home.png     # PNG
xcrun simctl spawn booted log stream --predicate 'process == "MedMate"'
xcrun simctl privacy booted grant photos in.medmate.customer
```

The iOS canvas is **393 x 852 pt** (iPhone 15). The app's brand zone is drawn
with a 54pt status bar, but a real iPhone 15 reports a safe-area top of
**59pt** - so the hero sits 5pt lower than the design unless the layout uses
`useSafeAreaInsets()` (it does). The home indicator is 34pt on iOS and the
Android gesture bar is 24dp - never hard-code either.

---

## 5. The environment to pin

An emulator or simulator that has drifted from a colleague's will produce
"bugs" that only exist on that machine. Pin all of this:

```bash
ADB=~/Library/Android/sdk/platform-tools/adb

# system animations off - makes screenshots deterministic
$ADB shell settings put global window_animation_scale 0
$ADB shell settings put global transition_animation_scale 0
$ADB shell settings put global animator_duration_scale 0

# font scale (1.0 = default; 1.3 is what many users run)
$ADB shell settings put system font_scale 1.0

# dark mode, and the battery/overscroll behaviour
$ADB shell cmd uimode night no
$ADB shell settings put global enable_overscroll 0

# locale and timezone
$ADB shell setprop persist.sys.locale en-IN
$ADB shell setprop persist.sys.timezone Asia/Kolkata
```

For iOS: **Settings > Accessibility > Display & Text Size > Larger Text**,
**Developer > Reduce Motion**, and `xcrun simctl status_bar booted override
--time "9:41" --batteryState charged --batteryLevel 100` for a stable status
bar in screenshots.

Then apply the same to the app:

- `StatusBar` style per screen (light content on the brand gradient).
- `expo-system-ui` for the root background, so the launch screen matches the
  first frame instead of flashing white.
- `userInterfaceStyle: "light"` in `app.json` unless you build a dark theme.

---

## 6. What to test, in this order

1. **Layout at the design canvas** - 411 x 914 dp (Android) and 393 x 852 pt
   (iOS). This is where the Figma matches pixel for pixel.
2. **Layout one step down** - 360 x 800 dp and 390 x 844 pt. Fixed-width
   grids usually break here.
3. **Layout at the edge** - 320 dp, and a tablet (600 dp+) where the rails
   should not stretch to the full width.
4. **Real photos.** The art tiles are placeholders; a 240pt photo is not a
   240pt block of colour. Check the crop, the radius and the contrast of the
   label over it.
5. **Type scale at 1.3** and the longest strings (the longest product name,
   the longest store name) with `numberOfLines` respected.
6. **Empty, loading and error states.** Every list filters live, so every list
   needs an empty state; nothing loads yet, so nothing has a skeleton yet.
7. **The system chrome**: back button, edge swipe, the gesture bar, the home
   indicator, the keyboard over the search field.
8. **Performance on a release build** - startup time, frame rate while
   scrolling the home screen, and memory.

---

## 7. Automating it

### 7.1 Maestro flows (no app changes)

```yaml
# .maestro/shop-home.yaml
appId: in.medmate.customer
---
- launchApp
- assertVisible: "MedMate"
- tapOn: "Search"
- assertVisible: "Search medicines"
- back
```

```bash
maestro test .maestro/
```

### 7.2 Golden screenshots

```bash
#!/usr/bin/env bash
set -euo pipefail
ADB=~/Library/Android/sdk/platform-tools/adb
OUT=${1:-./snapshots}
mkdir -p "$OUT"

shoot () {
  $ADB exec-out screencap -p > "$OUT/$1.png"
}

$ADB shell am force-stop in.medmate.customer
$ADB shell monkey -p in.medmate.customer -c android.intent.category.LAUNCHER 1 >/dev/null
sleep 8; shoot 01-home

$ADB shell input swipe 540 1800 540 600 400; sleep 2; shoot 02-home-scrolled
$ADB shell input tap 540 1200; sleep 3; shoot 03-detail
```

Diff against the Figma renders with `pixelmatch` or `looks-same`, and keep the
snaps next to the design so a regression is obvious.

### 7.3 CI

```yaml
# .github/workflows/android.yml
jobs:
  android:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run typecheck && npm run lint
      - name: Build the APK
        run: |
          cd apps/mobile && npx expo prebuild --platform android
          cd android
          JAVA_HOME=/opt/homebrew/opt/openjdk@17 \
          ANDROID_HOME=$HOME/Library/Android/sdk \
          ./gradlew assembleRelease
      - name: Boot the emulator and smoke test
        run: |
          $ANDROID_HOME/emulator/emulator -avd medmate -no-window -gpu swiftshader_indirect &
          $ANDROID_HOME/platform-tools/adb wait-for-device
          $ANDROID_HOME/platform-tools/adb install -r app/build/outputs/apk/release/app-release.apk
          $ANDROID_HOME/platform-tools/adb shell monkey -p in.medmate.customer 1
```

Use **macos-14** runners, not ubuntu: the Apple Silicon system image is
arm64-only, and an x86 runner cannot run it without translation.

---

## 8. Practical notes from this session

- **The debug key signs the local APK.** `assembleRelease` uses
  `android/app/debug.keystore`, so the build sideloads but cannot go to the
  Play Store. Use `npx eas-cli build -p android --profile preview` for that.
- **Stale native module versions break the build in ways TypeScript cannot
  see.** `react-native-safe-area-context` 5.7 nested under `apps/mobile`
  failed with `Unresolved reference 'uiImplementation'` while Expo 58 ships
  5.11.1. Run `npx expo install --fix` after any dependency change.
- **`react-dom` must stay a direct dependency of `apps/mobile`.** Without it
  the web SSR dev server renders with two copies of React and fails with
  "Invalid hook call".
- **Keep exactly one React copy.** `apps/mobile` pins `19.3.1` and the
  workspace root resolves the same version, so npm hoists a single copy.
- **`expo prebuild` rewrites the `android`/`ios` scripts** in
  `apps/mobile/package.json` to `expo run:*`. `git checkout` that file if you
  want the Expo Go flow back - `/android` and `/ios` are gitignored, so the
  generated project never reaches the repo.
- **A stray root `tsconfig.json`** is generated when Expo starts from the
  repository root by mistake. Delete it; the real one is `tsconfig.base.json`
  plus the per-package ones.

---

## 9. Pre-flight checklist before a release

- [ ] `npm run typecheck` and `npm run lint` clean
- [ ] `npx expo export --platform ios --platform android` succeeds
- [ ] Release APK builds and installs over the previous one
- [ ] Every screen checked at 320 / 360 / 411 dp and 393 / 430 pt
- [ ] Back gesture, system back button, keyboard and gesture bar all behave
- [ ] Empty states reachable on every list
- [ ] No `console.log` left in the bundle (`grep -r "console.log" apps/mobile/src`)
- [ ] Font scale 1.3 checked, longest strings checked
- [ ] Screenshots captured on the release build and compared to the Figma

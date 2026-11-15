import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  neutral,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Text } from '../ui/Text';
import { Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { ZoneBar, ZoneHeading } from '../ui/blocks';
import { AccountGroup, ConsentRow, HeldRow, PermissionRow } from './parts';
import { consents, dataActions, devicePermissions, heldData } from './data';

export type PrivacyScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onLink?: (id: string) => void;
};

/**
 * Privacy and permissions.
 *
 * The Figma `07 Account / Privacy & data` frame: what the app is allowed to
 * do, what the shopper has agreed to, what the account holds and what can
 * be done with it.
 */
export function PrivacyScreen({ onBack, onHelp, onLink }: PrivacyScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: inset }}>
              <ZoneBar
                backLabel="Account"
                title="Privacy and permissions"
                onBack={onBack}
                onHelp={onHelp}
              />
            </View>
            <View style={[styles.zoneHeading, { paddingHorizontal: inset }]}>
              <ZoneHeading
                title="You are in control"
                body="Tap any item to allow it or turn it off. Turning something off is as easy as turning it on. You agreed to the Terms on 1 Oct 2026."
              />
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          <View style={styles.group}>
            <Text variant="footnote" color={semantic.textMuted}>
              Device permissions
            </Text>
            <View style={styles.rows}>
              {devicePermissions.map((permission, index) => (
                <View key={permission.id}>
                  {index > 0 ? <View style={styles.separator} /> : null}
                  <PermissionRow
                    title={permission.title}
                    body={permission.body}
                    icon={permission.icon}
                    state={permission.state}
                  />
                </View>
              ))}
            </View>
            <Text variant="caption" color={semantic.textMuted}>
              Asked only when a feature needs it. You can also change these in your phone’s
              settings.
            </Text>
          </View>

          <View style={styles.group}>
            <Text variant="footnote" color={semantic.textMuted}>
              Your consents
            </Text>
            <View style={styles.rows}>
              {consents.map((consent, index) => (
                <View key={consent.id}>
                  {index > 0 ? <View style={styles.separator} /> : null}
                  <ConsentRow
                    title={consent.title}
                    body={consent.body}
                    icon={consent.icon}
                  />
                </View>
              ))}
            </View>
            <Text variant="caption" color={semantic.textMuted}>
              Health information and usage data are part of the Terms you accepted. Offers are
              optional and off unless you turned them on.
            </Text>
          </View>

          <View style={styles.group}>
            <Text variant="footnote" color={semantic.textMuted}>
              What your account holds
            </Text>
            <View style={styles.rows}>
              {heldData.map((held) => (
                <HeldRow key={held.label} label={held.label} value={held.value} />
              ))}
            </View>
            <Text variant="caption" color={semantic.textMuted}>
              Saved to your account so it is on every device you sign in on.
            </Text>
          </View>

          <View style={styles.group}>
            <Text variant="footnote" color={semantic.textMuted}>
              Your data
            </Text>
            <AccountGroup links={dataActions} onPress={onLink} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.page },
  scroll: { flex: 1 },
  zone: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  zoneInner: { paddingBottom: spacing.lg },
  zoneHeading: { marginTop: spacing.md },
  content: { gap: spacing.lg, paddingTop: spacing.lg },
  group: { gap: spacing.sm },
  rows: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    marginLeft: 60,
    backgroundColor: neutral.line,
  },
});

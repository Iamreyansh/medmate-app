import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  brand,
  mint,
  neutral,
  platformKey,
  radii,
  semantic,
  spacing,
} from '@medmate/theme';

import { Icon } from '../icons/Icon';
import { useCheckout } from '../state/checkout';
import { Text } from '../ui/Text';
import { Button, Gradient } from '../ui/primitives';
import { useContentInset } from '../ui/layout';
import { Field } from './parts';

const isAndroid = platformKey === 'android';

/** The names the address can be saved under. */
const addressLabels = ['Home', 'Work', 'Other'];

/** The instructions the rider can be given, as pills. */
const instructionPills = [
  'Call when you arrive',
  'Leave with security',
  'Don’t ring the bell',
  'Lift is not working',
];

export type AddressScreenProps = {
  onBack?: () => void;
  onHelp?: () => void;
  onSave?: () => void;
  onUseMyNumber?: () => void;
};

/**
 * Add or change the delivery address.
 *
 * The Figma `01 Onboarding / Address add/edit` frame is the address form. The
 * checkout reaches it from "Deliver to", so the address it saves is the one
 * the order goes to.
 */
export function AddressScreen({
  onBack,
  onHelp,
  onSave,
  onUseMyNumber,
}: AddressScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = useContentInset();
  const checkout = useCheckout();

  const [label, setLabel] = useState('Home');
  const [flat, setFlat] = useState('Flat 302, Sri Sai Residency');
  const [area, setArea] = useState('7th Cross, Jayanagar 4th Block');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560011');
  const [name, setName] = useState('You');
  const [mobile, setMobile] = useState('+91 98450 12345');
  const [instructions, setInstructions] = useState(checkout.instructions);
  const [pills, setPills] = useState<string[]>(['Call when you arrive']);
  const [deliverHere, setDeliverHere] = useState(true);

  const togglePill = (pill: string) =>
    setPills((current) =>
      current.includes(pill) ? current.filter((item) => item !== pill) : [...current, pill],
    );

  const save = () => {
    checkout.setAddress(`${flat}, ${area} · ${pincode}`);
    checkout.setInstructions(instructions);
    onSave?.();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand zone */}
        <Gradient token="brand" radius={radii.huge} style={styles.zone}>
          <View style={[styles.zoneInner, { paddingTop: insets.top }]}>
            <View style={[styles.navBar, { paddingHorizontal: inset }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={onBack}
                hitSlop={10}
                style={styles.back}
              >
                <Icon
                  name={isAndroid ? 'arrow-left' : 'chev-l'}
                  size={isAndroid ? 24 : 20}
                  color={neutral.surface}
                  strokeWidth={isAndroid ? 2 : 2.2}
                />
              </Pressable>
              <Text variant="storeNavTitle" color={neutral.surface}>
                Add address
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Help and support"
                onPress={onHelp}
                style={styles.helpButton}
              >
                <Icon name="bell" size={18} color={neutral.surface} />
              </Pressable>
            </View>

            <View style={[styles.zoneContent, { paddingHorizontal: inset }]}>
              <Text variant="storeTitle" color={neutral.surface}>
                Where should we deliver?
              </Text>
              <Text variant="caption" color={mint[200]}>
                Add a landmark and a number the rider can call, so they find you first time.
              </Text>
            </View>
          </View>
        </Gradient>

        <View style={[styles.content, { paddingHorizontal: inset }]}>
          {/* The note that sits under the zone. */}
          <View style={styles.noteCard}>
            <Icon name="pin" size={16} color={brand.green700} />
            <Text variant="caption" color={semantic.textSecondary} style={styles.noteText}>
              Without a pin, the rider finds you from the address you type and may call the
              number below.
            </Text>
          </View>

          {/* Address details */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              Address details
            </Text>

            <View style={styles.fieldGroup}>
              <Text variant="footnoteEmphasized" color={semantic.text}>
                Save as
              </Text>
              <View style={styles.pills}>
                {addressLabels.map((option) => {
                  const selected = option === label;
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => setLabel(option)}
                      style={({ pressed }) => [
                        styles.pill,
                        selected ? styles.pillOn : null,
                        pressed ? { opacity: 0.9 } : null,
                      ]}
                    >
                      <Text
                        variant="footnoteEmphasized"
                        color={selected ? neutral.surface : semantic.textSecondary}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Field
              label="Flat, house or building"
              value={flat}
              onChangeText={setFlat}
              placeholder="Flat 302, Sri Sai Residency"
            />
            <Field
              label="Area and street"
              value={area}
              onChangeText={setArea}
              placeholder="7th Cross, Jayanagar 4th Block"
            />
            <Field
              label="Landmark (optional)"
              value={landmark}
              onChangeText={setLandmark}
              placeholder="Near the temple"
              helper="A shop, temple or school nearby"
            />

            <View style={styles.pairRow}>
              <Field
                label="City"
                value={city}
                onChangeText={setCity}
                style={styles.pair}
              />
              <Field
                label="Pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                autoCapitalize="none"
                style={styles.pair}
              />
            </View>
          </View>

          {/* Who receives it */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              Who receives it?
            </Text>
            <Field label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
            <Field
              label="Mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              helper="The rider calls this number if they cannot find you"
            />
            <Pressable
              accessibilityRole="button"
              onPress={onUseMyNumber}
              style={({ pressed }) => [styles.useNumber, pressed ? { opacity: 0.85 } : null]}
            >
              <Icon name="user" size={14} color={semantic.textMuted} />
              <Text variant="footnoteEmphasized" color={semantic.text}>
                Use my number
              </Text>
            </Pressable>
          </View>

          {/* Instructions for the rider */}
          <View style={styles.card}>
            <Text variant="headline" color={semantic.text}>
              Instructions for the rider
            </Text>
            <Text variant="caption" color={semantic.textSecondary}>
              Optional. Shown to the rider for deliveries to this address.
            </Text>

            <View style={styles.pills}>
              {instructionPills.map((pill) => {
                const selected = pills.includes(pill);
                return (
                  <Pressable
                    key={pill}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    onPress={() => togglePill(pill)}
                    style={({ pressed }) => [
                      styles.pill,
                      selected ? styles.pillOn : null,
                      pressed ? { opacity: 0.9 } : null,
                    ]}
                  >
                    <Text
                      variant="footnoteEmphasized"
                      color={selected ? neutral.surface : semantic.textSecondary}
                    >
                      {pill}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Field
              label="Your instructions"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Leave at the door"
              helper={`${instructions.length}/140`}
              multiline
            />
          </View>

          {/* Deliver here now */}
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: deliverHere }}
            onPress={() => setDeliverHere((current) => !current)}
            style={({ pressed }) => [styles.deliverHere, pressed ? { opacity: 0.9 } : null]}
          >
            <View style={[styles.checkbox, deliverHere ? styles.checkboxOn : null]}>
              {deliverHere ? (
                <Icon name="check" size={12} color={neutral.surface} />
              ) : null}
            </View>
            <View style={styles.deliverHereText}>
              <Text variant="buttonSmall" color={semantic.text}>
                Deliver here now
              </Text>
              <Text variant="caption" color={semantic.textMuted}>
                Use this as your delivery address for the next order.
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Action bar ------------------------------------------------------ */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.actionInner, { paddingHorizontal: inset }]}>
          <Button
            label="Save and deliver here"
            tone="filled"
            size="large"
            icon="pin"
            chevron
            onPress={save}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: semantic.page,
  },
  scroll: {
    flex: 1,
  },
  zone: {
    borderBottomLeftRadius: radii.huge,
    borderBottomRightRadius: radii.huge,
    overflow: 'hidden',
  },
  zoneInner: {
    paddingBottom: spacing.lg,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  back: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneContent: {
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  noteCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: mint[200],
    backgroundColor: neutral.surface,
  },
  noteText: {
    flex: 1,
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: neutral.line,
    backgroundColor: neutral.surface,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: neutral.line2,
    backgroundColor: neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOn: {
    backgroundColor: brand.forest,
    borderColor: brand.forest,
  },
  pairRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pair: {
    flex: 1,
  },
  useNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deliverHere: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  deliverHereText: {
    flex: 1,
    gap: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.circle,
    borderWidth: 1.5,
    borderColor: neutral.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: brand.green700,
    borderColor: brand.green700,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: neutral.surface,
    borderTopWidth: 1,
    borderTopColor: neutral.line,
  },
  actionInner: {
    paddingTop: spacing.md,
  },
});

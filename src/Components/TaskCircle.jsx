import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, FONTS } from '../theme/Themes';

export default function TaskCircle({
completedTasks,
totalTasks,
}) {
const progress =
totalTasks === 0
? 0
: Math.min(completedTasks / totalTasks, 1);

const radius = 140;
const strokeWidth = 16;
const circumferenceCalc = 2 * Math.PI * radius;
const circumference = circumferenceCalc / 2 
const strokeDashoffset = circumference - progress * circumference;

return ( 
<View style={styles.circleContainer}> 
    <View style={styles.gaugeContainer}> 
        <Svg width={320} height={180}>
            {/* Background Arc */}
            
                <Circle
                cx="160"
                cy="160"
                r={radius}
                stroke={COLORS.cardBorder}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                />

                {/* Progress Arc */}
                <Circle
                cx="160"
                cy="160"
                r={radius}
                stroke={COLORS.primary}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="180"
                origin="160,160"
                />
        </Svg>

    <View style={styles.gaugeText}>
      <Text style={styles.circleNumber}>
        {Math.round(progress * 100)}%
      </Text>

      <Text style={styles.circleLabel}>
        {completedTasks}/{totalTasks}
      </Text>
    </View>
  </View>

  <Text style={styles.circleCaption}>
    {completedTasks === totalTasks && totalTasks > 0
      ? '🎉 All done!'
      : `${totalTasks - completedTasks} tasks left`}
  </Text>
</View>


);
}

const styles = StyleSheet.create({
circleContainer: {
alignItems: 'center',
marginVertical: SPACING.lg,
},

gaugeContainer: {
width: '100%',
height: 180,
justifyContent: 'center',
alignItems: 'center',
},

gaugeText: {
position: 'absolute',
top: 85,
alignItems: 'center',
},

circleNumber: {
fontSize: FONTS.xl,
color: COLORS.textPrimary,
fontWeight: '700',
},

circleLabel: {
fontSize: FONTS.sm,
color: COLORS.textSecondary,
},

circleCaption: {
marginTop: SPACING.sm,
color: COLORS.textSecondary,
fontSize: FONTS.sm,
},
});

// Vitora — Static data: exercises, foods, quotes, plans, achievements

export interface Exercise {
  id: string;
  name: string;
  primary: string[];
  secondary: string[];
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string;
  tips: string;
  type: 'strength' | 'cardio' | 'flexibility';
}

export interface Food {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

// 120+ exercises
export const EXERCISES: Exercise[] = [
  { id: 'ex1', name: 'Bench Press', primary: ['Chest'], secondary: ['Triceps', 'Shoulders'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Lie on bench, lower bar to chest, press up.', tips: 'Keep shoulder blades retracted.', type: 'strength' },
  { id: 'ex2', name: 'Incline Dumbbell Press', primary: ['Chest'], secondary: ['Shoulders', 'Triceps'], equipment: 'Dumbbell', difficulty: 'Intermediate', instructions: 'Press dumbbells up on incline bench.', tips: 'Angle bench 30-45 degrees.', type: 'strength' },
  { id: 'ex3', name: 'Push-Up', primary: ['Chest'], secondary: ['Triceps', 'Core'], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Lower body to floor, push up.', tips: 'Keep body straight.', type: 'strength' },
  { id: 'ex4', name: 'Cable Fly', primary: ['Chest'], secondary: ['Shoulders'], equipment: 'Cable', difficulty: 'Intermediate', instructions: 'Bring cables together in front.', tips: 'Slight bend in elbows.', type: 'strength' },
  { id: 'ex5', name: 'Dips', primary: ['Chest', 'Triceps'], secondary: ['Shoulders'], equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: 'Lower body between parallel bars.', tips: 'Lean forward for chest emphasis.', type: 'strength' },
  { id: 'ex6', name: 'Decline Press', primary: ['Chest'], secondary: ['Triceps'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Press on decline bench.', tips: 'Use spotter.', type: 'strength' },
  { id: 'ex7', name: 'Machine Chest Press', primary: ['Chest'], secondary: ['Triceps', 'Shoulders'], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Press handles forward on machine.', tips: 'Full range of motion.', type: 'strength' },
  { id: 'ex8', name: 'Dumbbell Fly', primary: ['Chest'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Open arms wide, bring together.', tips: 'Focus on stretch.', type: 'strength' },

  { id: 'ex9', name: 'Pull-Up', primary: ['Back'], secondary: ['Biceps'], equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: 'Pull body up to bar.', tips: 'Full hang start.', type: 'strength' },
  { id: 'ex10', name: 'Deadlift', primary: ['Back', 'Hamstrings'], secondary: ['Core', 'Glutes'], equipment: 'Barbell', difficulty: 'Advanced', instructions: 'Lift bar from floor to hip height.', tips: 'Keep back straight.', type: 'strength' },
  { id: 'ex11', name: 'Bent-Over Row', primary: ['Back'], secondary: ['Biceps'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Row bar to lower chest.', tips: 'Hinge at hips.', type: 'strength' },
  { id: 'ex12', name: 'Lat Pulldown', primary: ['Back'], secondary: ['Biceps'], equipment: 'Cable', difficulty: 'Beginner', instructions: 'Pull bar to upper chest.', tips: 'Squeeze shoulder blades.', type: 'strength' },
  { id: 'ex13', name: 'Seated Cable Row', primary: ['Back'], secondary: ['Biceps'], equipment: 'Cable', difficulty: 'Beginner', instructions: 'Row handle to torso.', tips: 'Don\'t rock back.', type: 'strength' },
  { id: 'ex14', name: 'T-Bar Row', primary: ['Back'], secondary: ['Biceps'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Row T-bar to chest.', tips: 'Keep core tight.', type: 'strength' },
  { id: 'ex15', name: 'Face Pull', primary: ['Shoulders', 'Back'], secondary: [], equipment: 'Cable', difficulty: 'Beginner', instructions: 'Pull rope to face.', tips: 'Lead with elbows.', type: 'strength' },
  { id: 'ex16', name: 'Single-Arm Row', primary: ['Back'], secondary: ['Biceps'], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Row dumbbell with one arm.', tips: 'Stabilize with other hand.', type: 'strength' },
  { id: 'ex17', name: 'Chin-Up', primary: ['Back', 'Biceps'], secondary: [], equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: 'Pull-up with underhand grip.', tips: 'Full range.', type: 'strength' },
  { id: 'ex18', name: 'Pendlay Row', primary: ['Back'], secondary: [], equipment: 'Barbell', difficulty: 'Advanced', instructions: 'Explosive row from floor each rep.', tips: 'Reset each rep.', type: 'strength' },

  { id: 'ex19', name: 'Overhead Press', primary: ['Shoulders'], secondary: ['Triceps'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Press bar overhead.', tips: 'Brace core.', type: 'strength' },
  { id: 'ex20', name: 'Lateral Raise', primary: ['Shoulders'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Raise dumbbells to sides.', tips: 'Lead with elbows.', type: 'strength' },
  { id: 'ex21', name: 'Front Raise', primary: ['Shoulders'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Raise dumbbells forward.', tips: 'Don\'t swing.', type: 'strength' },
  { id: 'ex22', name: 'Rear Delt Fly', primary: ['Shoulders'], secondary: ['Back'], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Fly on reverse incline bench.', tips: 'Squeeze rear delts.', type: 'strength' },
  { id: 'ex23', name: 'Arnold Press', primary: ['Shoulders'], secondary: ['Triceps'], equipment: 'Dumbbell', difficulty: 'Intermediate', instructions: 'Press with rotation.', tips: 'Smooth rotation.', type: 'strength' },
  { id: 'ex24', name: 'Upright Row', primary: ['Shoulders', 'Traps'], secondary: [], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Row bar to chin.', tips: 'Keep close to body.', type: 'strength' },
  { id: 'ex25', name: 'Shrugs', primary: ['Traps'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Shug shoulders up.', tips: 'Hold at top.', type: 'strength' },

  { id: 'ex26', name: 'Squat', primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Lower hips to floor, stand up.', tips: 'Knees track over toes.', type: 'strength' },
  { id: 'ex27', name: 'Front Squat', primary: ['Quads'], secondary: ['Core', 'Glutes'], equipment: 'Barbell', difficulty: 'Advanced', instructions: 'Squat with bar in front.', tips: 'Keep elbows up.', type: 'strength' },
  { id: 'ex28', name: 'Leg Press', primary: ['Quads'], secondary: ['Glutes', 'Hamstrings'], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Press platform away.', tips: 'Don\'t lock knees.', type: 'strength' },
  { id: 'ex29', name: 'Lunges', primary: ['Quads', 'Glutes'], secondary: ['Hamstrings'], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Step forward, lower back knee.', tips: 'Keep torso upright.', type: 'strength' },
  { id: 'ex30', name: 'Romanian Deadlift', primary: ['Hamstrings', 'Glutes'], secondary: ['Back'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Hinge hips, lower bar.', tips: 'Soft knees.', type: 'strength' },
  { id: 'ex31', name: 'Leg Curl', primary: ['Hamstrings'], secondary: [], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Curl legs on machine.', tips: 'Control negative.', type: 'strength' },
  { id: 'ex32', name: 'Leg Extension', primary: ['Quads'], secondary: [], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Extend knees on machine.', tips: 'Squeeze at top.', type: 'strength' },
  { id: 'ex33', name: 'Calf Raise', primary: ['Calves'], secondary: [], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Raise heels.', tips: 'Full stretch.', type: 'strength' },
  { id: 'ex34', name: 'Hip Thrust', primary: ['Glutes'], secondary: ['Hamstrings'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Thrust hips up with bar on hips.', tips: 'Squeeze glutes hard.', type: 'strength' },
  { id: 'ex35', name: 'Bulgarian Split Squat', primary: ['Quads', 'Glutes'], secondary: [], equipment: 'Dumbbell', difficulty: 'Advanced', instructions: 'Split squat with rear foot elevated.', tips: 'Keep balance.', type: 'strength' },
  { id: 'ex36', name: 'Goblet Squat', primary: ['Quads'], secondary: ['Core'], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Squat holding dumbbell at chest.', tips: 'Keep chest up.', type: 'strength' },
  { id: 'ex37', name: 'Step-Up', primary: ['Quads', 'Glutes'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Step onto box.', tips: 'Drive through heel.', type: 'strength' },
  { id: 'ex38', name: 'Good Morning', primary: ['Hamstrings', 'Back'], secondary: ['Glutes'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Hinge forward with bar on back.', tips: 'Keep back flat.', type: 'strength' },
  { id: 'ex39', name: 'Cable Kickback', primary: ['Glutes'], secondary: [], equipment: 'Cable', difficulty: 'Beginner', instructions: 'Kick leg back with cable.', tips: 'Squeeze glute.', type: 'strength' },
  { id: 'ex40', name: 'Abductor Machine', primary: ['Glutes'], secondary: [], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Push legs outward.', tips: 'Control movement.', type: 'strength' },

  { id: 'ex41', name: 'Bicep Curl', primary: ['Biceps'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Curl dumbbells up.', tips: 'Keep elbows fixed.', type: 'strength' },
  { id: 'ex42', name: 'Hammer Curl', primary: ['Biceps', 'Forearms'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Curl with neutral grip.', tips: 'Don\'t swing.', type: 'strength' },
  { id: 'ex43', name: 'Preacher Curl', primary: ['Biceps'], secondary: [], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Curl on preacher bench.', tips: 'Full extension.', type: 'strength' },
  { id: 'ex44', name: 'Concentration Curl', primary: ['Biceps'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Curl one arm braced on thigh.', tips: 'Focus on peak.', type: 'strength' },
  { id: 'ex45', name: 'Cable Curl', primary: ['Biceps'], secondary: [], equipment: 'Cable', difficulty: 'Beginner', instructions: 'Curl cable attachment.', tips: 'Constant tension.', type: 'strength' },
  { id: 'ex46', name: 'Tricep Pushdown', primary: ['Triceps'], secondary: [], equipment: 'Cable', difficulty: 'Beginner', instructions: 'Push cable down.', tips: 'Keep elbows tucked.', type: 'strength' },
  { id: 'ex47', name: 'Skull Crusher', primary: ['Triceps'], secondary: [], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Lower bar to forehead, extend.', tips: 'Don\'t flare elbows.', type: 'strength' },
  { id: 'ex48', name: 'Overhead Tricep Extension', primary: ['Triceps'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Extend dumbbell overhead.', tips: 'Full stretch.', type: 'strength' },
  { id: 'ex49', name: 'Close-Grip Bench', primary: ['Triceps', 'Chest'], secondary: [], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Bench with narrow grip.', tips: 'Tuck elbows.', type: 'strength' },
  { id: 'ex50', name: 'Tricep Kickback', primary: ['Triceps'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Extend arm back.', tips: 'Keep upper arm still.', type: 'strength' },

  { id: 'ex51', name: 'Plank', primary: ['Core'], secondary: ['Shoulders'], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Hold push-up position on forearms.', tips: 'Keep body straight.', type: 'strength' },
  { id: 'ex52', name: 'Crunch', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Curl shoulders off floor.', tips: 'Don\'t pull neck.', type: 'strength' },
  { id: 'ex53', name: 'Hanging Leg Raise', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Advanced', instructions: 'Raise legs while hanging.', tips: 'Control the lower.', type: 'strength' },
  { id: 'ex54', name: 'Russian Twist', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Twist torso side to side.', tips: 'Keep feet up.', type: 'strength' },
  { id: 'ex55', name: 'Mountain Climber', primary: ['Core', 'Cardio'], secondary: ['Shoulders'], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Alternate knees to chest.', tips: 'Fast pace.', type: 'strength' },
  { id: 'ex56', name: 'Cable Crunch', primary: ['Core'], secondary: [], equipment: 'Cable', difficulty: 'Intermediate', instructions: 'Crunch with cable resistance.', tips: 'Round back.', type: 'strength' },
  { id: 'ex57', name: 'Side Plank', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Hold plank on side.', tips: 'Keep hips up.', type: 'strength' },
  { id: 'ex58', name: 'Dead Bug', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Alternate arm and leg extensions.', tips: 'Keep back flat.', type: 'strength' },
  { id: 'ex59', name: 'Hollow Hold', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Advanced', instructions: 'Hold hollow body position.', tips: 'Press lower back down.', type: 'strength' },
  { id: 'ex60', name: 'Wood Chop', primary: ['Core'], secondary: ['Shoulders'], equipment: 'Cable', difficulty: 'Intermediate', instructions: 'Rotate cable across body.', tips: 'Power from core.', type: 'strength' },

  { id: 'ex61', name: 'Running', primary: ['Cardio'], secondary: ['Legs'], equipment: 'None', difficulty: 'Beginner', instructions: 'Run at steady pace.', tips: 'Build gradually.', type: 'cardio' },
  { id: 'ex62', name: 'Cycling', primary: ['Cardio'], secondary: ['Legs'], equipment: 'Bike', difficulty: 'Beginner', instructions: 'Cycle at moderate pace.', tips: 'Adjust seat height.', type: 'cardio' },
  { id: 'ex63', name: 'Rowing', primary: ['Cardio', 'Back'], secondary: ['Legs'], equipment: 'Rower', difficulty: 'Beginner', instructions: 'Row on machine.', tips: 'Legs then back then arms.', type: 'cardio' },
  { id: 'ex64', name: 'Jump Rope', primary: ['Cardio'], secondary: ['Calves'], equipment: 'Jump Rope', difficulty: 'Beginner', instructions: 'Jump over rope.', tips: 'Stay light on feet.', type: 'cardio' },
  { id: 'ex65', name: 'Burpee', primary: ['Cardio', 'Full Body'], secondary: ['Chest', 'Legs'], equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: 'Squat, push-up, jump.', tips: 'Keep pace.', type: 'cardio' },
  { id: 'ex66', name: 'Box Jump', primary: ['Legs', 'Cardio'], secondary: [], equipment: 'Box', difficulty: 'Intermediate', instructions: 'Jump onto box.', tips: 'Land softly.', type: 'cardio' },
  { id: 'ex67', name: 'Stair Climber', primary: ['Cardio', 'Legs'], secondary: [], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Climb on stair machine.', tips: 'Don\'t lean on rails.', type: 'cardio' },
  { id: 'ex68', name: 'Elliptical', primary: ['Cardio'], secondary: ['Full Body'], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Use elliptical machine.', tips: 'Use handles.', type: 'cardio' },
  { id: 'ex69', name: 'Sprint Intervals', primary: ['Cardio'], secondary: ['Legs'], equipment: 'None', difficulty: 'Advanced', instructions: 'Alternate sprint and walk.', tips: 'Full recovery.', type: 'cardio' },
  { id: 'ex70', name: 'Battle Ropes', primary: ['Cardio', 'Shoulders'], secondary: ['Core'], equipment: 'Ropes', difficulty: 'Intermediate', instructions: 'Wave ropes vigorously.', tips: 'Use whole body.', type: 'cardio' },

  { id: 'ex71', name: 'HIIT Circuit', primary: ['Cardio', 'Full Body'], secondary: [], equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: 'Rotate exercises 30s on 15s off.', tips: 'Max effort.', type: 'cardio' },
  { id: 'ex72', name: 'Kettlebell Swing', primary: ['Glutes', 'Hamstrings', 'Cardio'], secondary: ['Back', 'Shoulders'], equipment: 'Kettlebell', difficulty: 'Intermediate', instructions: 'Swing kettlebell with hip hinge.', tips: 'Power from hips.', type: 'cardio' },
  { id: 'ex73', name: 'Thruster', primary: ['Quads', 'Shoulders'], secondary: ['Core'], equipment: 'Barbell', difficulty: 'Advanced', instructions: 'Squat then press overhead.', tips: 'Fluid motion.', type: 'cardio' },
  { id: 'ex74', name: 'Clean', primary: ['Back', 'Legs'], secondary: ['Shoulders'], equipment: 'Barbell', difficulty: 'Advanced', instructions: 'Lift bar from floor to shoulders.', tips: 'Explosive extension.', type: 'strength' },
  { id: 'ex75', name: 'Snatch', primary: ['Full Body'], secondary: [], equipment: 'Barbell', difficulty: 'Advanced', instructions: 'Lift bar overhead in one motion.', tips: 'Practice technique.', type: 'strength' },
  { id: 'ex76', name: 'Turkish Get-Up', primary: ['Full Body', 'Core'], secondary: [], equipment: 'Kettlebell', difficulty: 'Advanced', instructions: 'Stand up from floor with weight overhead.', tips: 'Keep arm locked.', type: 'strength' },

  { id: 'ex77', name: 'Forward Bend', primary: ['Hamstrings', 'Back'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Bend forward, reach for toes.', tips: 'Don\'t force stretch.', type: 'flexibility' },
  { id: 'ex78', name: 'Downward Dog', primary: ['Back', 'Shoulders', 'Hamstrings'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Inverted V pose.', tips: 'Press heels down.', type: 'flexibility' },
  { id: 'ex79', name: 'Pigeon Pose', primary: ['Glutes', 'Hips'], secondary: [], equipment: 'None', difficulty: 'Intermediate', instructions: 'Hip opener stretch.', tips: 'Breathe into stretch.', type: 'flexibility' },
  { id: 'ex80', name: 'Cobra Stretch', primary: ['Chest', 'Abs'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Lift chest off floor.', tips: 'Keep hips down.', type: 'flexibility' },
  { id: 'ex81', name: 'Child Pose', primary: ['Back', 'Hips'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Kneel, fold forward.', tips: 'Relax shoulders.', type: 'flexibility' },
  { id: 'ex82', name: 'Cat-Cow', primary: ['Back', 'Core'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Alternate arching and rounding back.', tips: 'Move with breath.', type: 'flexibility' },
  { id: 'ex83', name: 'Hip Flexor Stretch', primary: ['Hips'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Lunge, push hips forward.', tips: 'Keep torso tall.', type: 'flexibility' },
  { id: 'ex84', name: 'Shoulder Mobility', primary: ['Shoulders'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Arm circles and rotations.', tips: 'Full range.', type: 'flexibility' },
  { id: 'ex85', name: 'Hamstring Stretch', primary: ['Hamstrings'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Extend leg, reach forward.', tips: 'Keep knee soft.', type: 'flexibility' },
  { id: 'ex86', name: 'Quad Stretch', primary: ['Quads'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Pull heel to glute.', tips: 'Keep knees together.', type: 'flexibility' },
  { id: 'ex87', name: 'Spinal Twist', primary: ['Back', 'Core'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Twist torso lying down.', tips: 'Relax into twist.', type: 'flexibility' },
  { id: 'ex88', name: 'Butterfly Stretch', primary: ['Hips', 'Groin'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Sit, soles together, press knees.', tips: 'Keep back straight.', type: 'flexibility' },

  { id: 'ex89', name: 'Cable Lateral Pulldown', primary: ['Back'], secondary: ['Biceps'], equipment: 'Cable', difficulty: 'Beginner', instructions: 'Pull bar to chest.', tips: 'Squeeze lats.', type: 'strength' },
  { id: 'ex90', name: 'Dumbbell Pullover', primary: ['Back', 'Chest'], secondary: [], equipment: 'Dumbbell', difficulty: 'Intermediate', instructions: 'Lower dumbbell behind head.', tips: 'Focus on lats.', type: 'strength' },
  { id: 'ex91', name: 'Hyperextension', primary: ['Back', 'Glutes'], secondary: ['Hamstrings'], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Extend torso on back extension.', tips: 'Don\'t hyperextend.', type: 'strength' },
  { id: 'ex92', name: 'Farmer Walk', primary: ['Forearms', 'Core'], secondary: ['Traps'], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Walk holding heavy weights.', tips: 'Keep posture.', type: 'strength' },
  { id: 'ex93', name: 'Wrist Curl', primary: ['Forearms'], secondary: [], equipment: 'Dumbbell', difficulty: 'Beginner', instructions: 'Curl wrists.', tips: 'Isolate forearms.', type: 'strength' },
  { id: 'ex94', name: 'Reverse Curl', primary: ['Forearms', 'Biceps'], secondary: [], equipment: 'Barbell', difficulty: 'Beginner', instructions: 'Curl with overhand grip.', tips: 'Control movement.', type: 'strength' },

  { id: 'ex95', name: 'Sumo Squat', primary: ['Quads', 'Glutes'], secondary: ['Inner Thighs'], equipment: 'Barbell', difficulty: 'Intermediate', instructions: 'Squat with wide stance.', tips: 'Push knees out.', type: 'strength' },
  { id: 'ex96', name: 'Glute Bridge', primary: ['Glutes', 'Hamstrings'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Bridge hips up from floor.', tips: 'Squeeze at top.', type: 'strength' },
  { id: 'ex97', name: 'Cable Wood Chop', primary: ['Core', 'Back'], secondary: [], equipment: 'Cable', difficulty: 'Intermediate', instructions: 'Chop cable across body.', tips: 'Rotate from core.', type: 'strength' },
  { id: 'ex98', name: 'Hanging Knee Raise', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: 'Raise knees while hanging.', tips: 'Avoid swinging.', type: 'strength' },
  { id: 'ex99', name: 'V-Up', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Advanced', instructions: 'Lift legs and torso into V.', tips: 'Control descent.', type: 'strength' },
  { id: 'ex100', name: 'Bicycle Crunch', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Alternate elbow to knee.', tips: 'Slow and controlled.', type: 'strength' },

  { id: 'ex101', name: 'Swimming', primary: ['Cardio', 'Back'], secondary: ['Shoulders'], equipment: 'None', difficulty: 'Beginner', instructions: 'Swim laps.', tips: 'Focus on form.', type: 'cardio' },
  { id: 'ex102', name: 'Incline Walk', primary: ['Cardio', 'Glutes'], secondary: [], equipment: 'Treadmill', difficulty: 'Beginner', instructions: 'Walk on incline.', tips: 'Don\'t hold rails.', type: 'cardio' },
  { id: 'ex103', name: 'Sled Push', primary: ['Legs', 'Cardio'], secondary: ['Core'], equipment: 'Sled', difficulty: 'Advanced', instructions: 'Push weighted sled.', tips: 'Drive hard.', type: 'cardio' },
  { id: 'ex104', name: 'Prowler Push', primary: ['Full Body', 'Cardio'], secondary: [], equipment: 'Sled', difficulty: 'Advanced', instructions: 'Push sled forward.', tips: 'Low body position.', type: 'cardio' },
  { id: 'ex105', name: 'Assault Bike', primary: ['Cardio'], secondary: ['Full Body'], equipment: 'Bike', difficulty: 'Intermediate', instructions: 'Ride air bike hard.', tips: 'Use arms and legs.', type: 'cardio' },

  { id: 'ex106', name: 'Standing Calf Raise', primary: ['Calves'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Raise heels standing.', tips: 'Full range.', type: 'strength' },
  { id: 'ex107', name: 'Seated Calf Raise', primary: ['Calves'], secondary: [], equipment: 'Machine', difficulty: 'Beginner', instructions: 'Raise calves seated.', tips: 'Slow negative.', type: 'strength' },
  { id: 'ex108', name: 'Tibialis Raise', primary: ['Tibialis'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Raise toes, lean on wall.', tips: 'Prevent shin splints.', type: 'strength' },

  { id: 'ex109', name: 'Lying Leg Raise', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Raise legs from floor.', tips: 'Keep lower back down.', type: 'strength' },
  { id: 'ex110', name: 'Flutter Kick', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Alternate small leg kicks.', tips: 'Keep core engaged.', type: 'strength' },
  { id: 'ex111', name: 'Scissor Kick', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Cross legs over and under.', tips: 'Control movement.', type: 'strength' },
  { id: 'ex112', name: 'Reverse Crunch', primary: ['Core'], secondary: [], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Curl hips toward chest.', tips: 'Lift pelvis.', type: 'strength' },

  { id: 'ex113', name: 'Yoga Flow', primary: ['Flexibility', 'Core'], secondary: ['Balance'], equipment: 'None', difficulty: 'Beginner', instructions: 'Flow through yoga poses.', tips: 'Move with breath.', type: 'flexibility' },
  { id: 'ex114', name: 'Warrior Pose', primary: ['Legs', 'Balance'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Lunge with arms extended.', tips: 'Hold and breathe.', type: 'flexibility' },
  { id: 'ex115', name: 'Tree Pose', primary: ['Balance', 'Legs'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Balance on one leg, other foot on thigh.', tips: 'Focus on a point.', type: 'flexibility' },
  { id: 'ex116', name: 'Triangle Pose', primary: ['Legs', 'Hips'], secondary: ['Back'], equipment: 'None', difficulty: 'Beginner', instructions: 'Wide stance, bend sideways.', tips: 'Keep legs straight.', type: 'flexibility' },
  { id: 'ex117', name: 'Seated Forward Bend', primary: ['Hamstrings', 'Back'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Reach forward from seated.', tips: 'Hinge from hips.', type: 'flexibility' },
  { id: 'ex118', name: 'Chest Opener', primary: ['Chest', 'Shoulders'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Clasp hands behind back, lift.', tips: 'Open chest.', type: 'flexibility' },
  { id: 'ex119', name: 'Neck Stretch', primary: ['Neck'], secondary: [], equipment: 'None', difficulty: 'Beginner', instructions: 'Tilt head to each side.', tips: 'Gentle pull.', type: 'flexibility' },
  { id: 'ex120', name: 'Foam Roll', primary: ['Recovery'], secondary: [], equipment: 'Foam Roller', difficulty: 'Beginner', instructions: 'Roll over tight muscles.', tips: 'Slow on tight spots.', type: 'flexibility' },
  { id: 'ex121', name: 'Wall Sit', primary: ['Quads'], secondary: ['Glutes'], equipment: 'Bodyweight', difficulty: 'Beginner', instructions: 'Hold seated position against wall.', tips: 'Thighs parallel.', type: 'strength' },
  { id: 'ex122', name: 'Isometric Hold', primary: ['Full Body'], secondary: [], equipment: 'Bodyweight', difficulty: 'Intermediate', instructions: 'Hold position under tension.', tips: 'Breathe steadily.', type: 'strength' },
];

// 200+ foods
export const FOODS: Food[] = [
  { id: 'f1', name: 'Chicken Breast', serving: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
  { id: 'f2', name: 'Brown Rice', serving: '1 cup cooked', calories: 218, protein: 5, carbs: 46, fat: 1.6, fiber: 3.5, sugar: 0.6, sodium: 10 },
  { id: 'f3', name: 'White Rice', serving: '1 cup cooked', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0, sodium: 1 },
  { id: 'f4', name: 'Salmon', serving: '100g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59 },
  { id: 'f5', name: 'Eggs', serving: '1 large', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, sugar: 0.2, sodium: 71 },
  { id: 'f6', name: 'Greek Yogurt', serving: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 6, sodium: 61 },
  { id: 'f7', name: 'Oatmeal', serving: '1 cup cooked', calories: 154, protein: 6, carbs: 27, fat: 3, fiber: 4, sugar: 1, sodium: 2 },
  { id: 'f8', name: 'Banana', serving: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1 },
  { id: 'f9', name: 'Apple', serving: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2 },
  { id: 'f10', name: 'Almonds', serving: '28g', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1, sodium: 0 },
  { id: 'f11', name: 'Broccoli', serving: '1 cup', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5, sugar: 2.2, sodium: 64 },
  { id: 'f12', name: 'Sweet Potato', serving: '1 medium', calories: 112, protein: 2, carbs: 26, fat: 0.1, fiber: 3.9, sugar: 5, sodium: 40 },
  { id: 'f13', name: 'Avocado', serving: '1/2 fruit', calories: 161, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.2, sodium: 7 },
  { id: 'f14', name: 'Tuna', serving: '100g', calories: 132, protein: 28, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 39 },
  { id: 'f15', name: 'Lean Beef', serving: '100g', calories: 217, protein: 26, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 56 },
  { id: 'f16', name: 'Pork Tenderloin', serving: '100g', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, sugar: 0, sodium: 55 },
  { id: 'f17', name: 'Shrimp', serving: '100g', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0, sodium: 111 },
  { id: 'f18', name: 'Tofu', serving: '100g', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.6, sodium: 7 },
  { id: 'f19', name: 'Lentils', serving: '1 cup cooked', calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 16, sugar: 3.6, sodium: 4 },
  { id: 'f20', name: 'Black Beans', serving: '1 cup', calories: 227, protein: 15, carbs: 41, fat: 0.9, fiber: 15, sugar: 0.7, sodium: 1 },
  { id: 'f21', name: 'Chickpeas', serving: '1 cup', calories: 269, protein: 15, carbs: 45, fat: 4.2, fiber: 13, sugar: 8, sodium: 48 },
  { id: 'f22', name: 'Quinoa', serving: '1 cup cooked', calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, sugar: 1.6, sodium: 13 },
  { id: 'f23', name: 'Spinach', serving: '1 cup', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, sodium: 24 },
  { id: 'f24', name: 'Kale', serving: '1 cup', calories: 33, protein: 2.9, carbs: 6.7, fat: 0.6, fiber: 1.3, sugar: 2.3, sodium: 18 },
  { id: 'f25', name: 'Carrots', serving: '1 cup', calories: 52, protein: 1.2, carbs: 12, fat: 0.3, fiber: 3.6, sugar: 6, sodium: 88 },
  { id: 'f26', name: 'Bell Pepper', serving: '1 medium', calories: 37, protein: 1.2, carbs: 7, fat: 0.4, fiber: 2.5, sugar: 5, sodium: 4 },
  { id: 'f27', name: 'Cucumber', serving: '1 cup', calories: 16, protein: 0.7, carbs: 3.8, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2 },
  { id: 'f28', name: 'Tomato', serving: '1 medium', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, sugar: 3.2, sodium: 6 },
  { id: 'f29', name: 'Onion', serving: '1 medium', calories: 44, protein: 1.2, carbs: 10, fat: 0.1, fiber: 1.9, sugar: 5, sodium: 4 },
  { id: 'f30', name: 'Mushrooms', serving: '1 cup', calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7, sugar: 1.4, sodium: 4 },
  { id: 'f31', name: 'Whole Wheat Bread', serving: '1 slice', calories: 82, protein: 4, carbs: 14, fat: 1.1, fiber: 2, sugar: 1.4, sodium: 132 },
  { id: 'f32', name: 'White Bread', serving: '1 slice', calories: 75, protein: 2.5, carbs: 14, fat: 1, fiber: 0.8, sugar: 1.6, sodium: 142 },
  { id: 'f33', name: 'Pasta', serving: '1 cup cooked', calories: 221, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5, sugar: 0.8, sodium: 1 },
  { id: 'f34', name: 'Peanut Butter', serving: '2 tbsp', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, sugar: 3, sodium: 152 },
  { id: 'f35', name: 'Olive Oil', serving: '1 tbsp', calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 0 },
  { id: 'f36', name: 'Milk (2%)', serving: '1 cup', calories: 122, protein: 8, carbs: 12, fat: 5, fiber: 0, sugar: 12, sodium: 115 },
  { id: 'f37', name: 'Almond Milk', serving: '1 cup', calories: 39, protein: 1.5, carbs: 3, fat: 2.5, fiber: 0.5, sugar: 0.5, sodium: 150 },
  { id: 'f38', name: 'Cheese (Cheddar)', serving: '28g', calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, sugar: 0.1, sodium: 174 },
  { id: 'f39', name: 'Cottage Cheese', serving: '1 cup', calories: 206, protein: 23, carbs: 6, fat: 9, fiber: 0, sugar: 6, sodium: 918 },
  { id: 'f40', name: 'Mozzarella', serving: '28g', calories: 85, protein: 6, carbs: 0.6, fat: 6, fiber: 0, sugar: 0.1, sodium: 150 },
  { id: 'f41', name: 'Whey Protein', serving: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, sugar: 1, sodium: 50 },
  { id: 'f42', name: 'Protein Bar', serving: '1 bar', calories: 220, protein: 20, carbs: 22, fat: 7, fiber: 5, sugar: 10, sodium: 200 },
  { id: 'f43', name: 'Orange', serving: '1 medium', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, sodium: 0 },
  { id: 'f44', name: 'Strawberries', serving: '1 cup', calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7.4, sodium: 2 },
  { id: 'f45', name: 'Blueberries', serving: '1 cup', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15, sodium: 1 },
  { id: 'f46', name: 'Grapes', serving: '1 cup', calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, sugar: 23, sodium: 3 },
  { id: 'f47', name: 'Watermelon', serving: '1 cup', calories: 46, protein: 0.9, carbs: 11, fat: 0.2, fiber: 0.6, sugar: 9, sodium: 2 },
  { id: 'f48', name: 'Pineapple', serving: '1 cup', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, sugar: 16, sodium: 2 },
  { id: 'f49', name: 'Mango', serving: '1 cup', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23, sodium: 2 },
  { id: 'f50', name: 'Peanuts', serving: '28g', calories: 161, protein: 7.3, carbs: 4.6, fat: 14, fiber: 2.4, sugar: 1, sodium: 95 },
  { id: 'f51', name: 'Walnuts', serving: '28g', calories: 185, protein: 4.3, carbs: 3.9, fat: 18, fiber: 1.9, sugar: 1, sodium: 1 },
  { id: 'f52', name: 'Cashews', serving: '28g', calories: 157, protein: 5.2, carbs: 8.4, fat: 12, fiber: 0.9, sugar: 1.7, sodium: 3 },
  { id: 'f53', name: 'Pistachios', serving: '28g', calories: 159, protein: 5.7, carbs: 7.7, fat: 13, fiber: 2.9, sugar: 2.2, sodium: 135 },
  { id: 'f54', name: 'Dark Chocolate', serving: '28g', calories: 170, protein: 2, carbs: 13, fat: 12, fiber: 2, sugar: 7, sodium: 5 },
  { id: 'f55', name: 'Honey', serving: '1 tbsp', calories: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0.1, sugar: 17, sodium: 1 },
  { id: 'f56', name: 'Maple Syrup', serving: '1 tbsp', calories: 52, protein: 0, carbs: 13, fat: 0, fiber: 0, sugar: 12, sodium: 1 },
  { id: 'f57', name: 'Coffee (Black)', serving: '1 cup', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5 },
  { id: 'f58', name: 'Green Tea', serving: '1 cup', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  { id: 'f59', name: 'Orange Juice', serving: '1 cup', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, sodium: 2 },
  { id: 'f60', name: 'Soda', serving: '1 can', calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39, sodium: 45 },
  { id: 'f61', name: 'Beer', serving: '12 oz', calories: 153, protein: 1.6, carbs: 13, fat: 0, fiber: 0, sugar: 0, sodium: 14 },
  { id: 'f62', name: 'Wine (Red)', serving: '5 oz', calories: 125, protein: 0.1, carbs: 4, fat: 0, fiber: 0, sugar: 1, sodium: 6 },
  { id: 'f63', name: 'Pizza Slice', serving: '1 slice', calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2, sugar: 4, sodium: 640 },
  { id: 'f64', name: 'Burger', serving: '1 burger', calories: 354, protein: 20, carbs: 29, fat: 17, fiber: 1.5, sugar: 5, sodium: 522 },
  { id: 'f65', name: 'French Fries', serving: 'medium', calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4, sugar: 0.3, sodium: 246 },
  { id: 'f66', name: 'Fried Chicken', serving: '1 piece', calories: 320, protein: 22, carbs: 12, fat: 19, fiber: 0.5, sugar: 0, sodium: 720 },
  { id: 'f67', name: 'Sushi Roll', serving: '6 pieces', calories: 255, protein: 9, carbs: 38, fat: 7, fiber: 1.5, sugar: 8, sodium: 590 },
  { id: 'f68', name: 'Taco', serving: '1 taco', calories: 170, protein: 8, carbs: 13, fat: 9, fiber: 2, sugar: 1, sodium: 350 },
  { id: 'f69', name: 'Burrito', serving: '1 burrito', calories: 445, protein: 20, carbs: 60, fat: 15, fiber: 7, sugar: 3, sodium: 1100 },
  { id: 'f70', name: 'Salad (Caesar)', serving: '1 bowl', calories: 190, protein: 8, carbs: 8, fat: 15, fiber: 2, sugar: 2, sodium: 380 },
  { id: 'f71', name: 'Sandwich (Turkey)', serving: '1 sandwich', calories: 285, protein: 25, carbs: 30, fat: 7, fiber: 2, sugar: 4, sodium: 980 },
  { id: 'f72', name: 'Soup (Chicken Noodle)', serving: '1 cup', calories: 60, protein: 3, carbs: 7, fat: 2, fiber: 1, sugar: 1, sodium: 820 },
  { id: 'f73', name: 'Steak', serving: '100g', calories: 271, protein: 25, carbs: 0, fat: 19, fiber: 0, sugar: 0, sodium: 56 },
  { id: 'f74', name: 'Ground Turkey', serving: '100g', calories: 189, protein: 27, carbs: 0, fat: 8, fiber: 0, sugar: 0, sodium: 103 },
  { id: 'f75', name: 'Bacon', serving: '2 slices', calories: 92, protein: 6, carbs: 0.2, fat: 7, fiber: 0, sugar: 0, sodium: 680 },
  { id: 'f76', name: 'Sausage', serving: '1 link', calories: 65, protein: 4, carbs: 1, fat: 5, fiber: 0, sugar: 0, sodium: 230 },
  { id: 'f77', name: 'Ham', serving: '28g', calories: 38, protein: 5, carbs: 0.5, fat: 1.5, fiber: 0, sugar: 0.3, sodium: 390 },
  { id: 'f78', name: 'Turkey Breast', serving: '100g', calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 54 },
  { id: 'f79', name: 'Cod', serving: '100g', calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, sugar: 0, sodium: 54 },
  { id: 'f80', name: 'Tilapia', serving: '100g', calories: 96, protein: 20, carbs: 0, fat: 2, fiber: 0, sugar: 0, sodium: 52 },
  { id: 'f81', name: 'Sardines', serving: '1 can', calories: 191, protein: 23, carbs: 0, fat: 11, fiber: 0, sugar: 0, sodium: 307 },
  { id: 'f82', name: 'Crab', serving: '100g', calories: 97, protein: 19, carbs: 0, fat: 1.5, fiber: 0, sugar: 0, sodium: 295 },
  { id: 'f83', name: 'Lobster', serving: '100g', calories: 89, protein: 19, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 330 },
  { id: 'f84', name: 'Scallops', serving: '100g', calories: 111, protein: 20, carbs: 5, fat: 1, fiber: 0, sugar: 0, sodium: 330 },
  { id: 'f85', name: 'Edamame', serving: '1 cup', calories: 189, protein: 17, carbs: 14, fat: 8, fiber: 8, sugar: 3, sodium: 9 },
  { id: 'f86', name: 'Tempeh', serving: '100g', calories: 193, protein: 21, carbs: 9, fat: 11, fiber: 9, sugar: 0, sodium: 9 },
  { id: 'f87', name: 'Seitan', serving: '100g', calories: 150, protein: 25, carbs: 6, fat: 2, fiber: 0.5, sugar: 0, sodium: 400 },
  { id: 'f88', name: 'Hummus', serving: '2 tbsp', calories: 50, protein: 2, carbs: 4, fat: 3, fiber: 1, sugar: 0.3, sodium: 130 },
  { id: 'f89', name: 'Pita Bread', serving: '1 pita', calories: 165, protein: 5.5, carbs: 33, fat: 1, fiber: 1.5, sugar: 0.5, sodium: 320 },
  { id: 'f90', name: 'Tortilla', serving: '1 medium', calories: 140, protein: 4, carbs: 24, fat: 4, fiber: 2, sugar: 1, sodium: 350 },
  { id: 'f91', name: 'Bagel', serving: '1 bagel', calories: 245, protein: 10, carbs: 48, fat: 1.5, fiber: 2, sugar: 4, sodium: 430 },
  { id: 'f92', name: 'Croissant', serving: '1 medium', calories: 231, protein: 5, carbs: 26, fat: 12, fiber: 1.5, sugar: 6, sodium: 260 },
  { id: 'f93', name: 'Muffin', serving: '1 medium', calories: 265, protein: 4, carbs: 48, fat: 9, fiber: 1.5, sugar: 28, sodium: 320 },
  { id: 'f94', name: 'Pancake', serving: '1 pancake', calories: 175, protein: 5, carbs: 22, fat: 7, fiber: 0.7, sugar: 5, sodium: 340 },
  { id: 'f95', name: 'Waffle', serving: '1 waffle', calories: 218, protein: 6, carbs: 25, fat: 11, fiber: 1.5, sugar: 5, sodium: 450 },
  { id: 'f96', name: 'Scrambled Eggs', serving: '2 eggs', calories: 182, protein: 12, carbs: 2, fat: 14, fiber: 0, sugar: 1, sodium: 170 },
  { id: 'f97', name: 'Omelette', serving: '2 eggs', calories: 220, protein: 14, carbs: 3, fat: 16, fiber: 0.5, sugar: 1, sodium: 250 },
  { id: 'f98', name: 'French Toast', serving: '2 slices', calories: 229, protein: 9, carbs: 24, fat: 11, fiber: 1, sugar: 8, sodium: 380 },
  { id: 'f99', name: 'Yogurt (Plain)', serving: '1 cup', calories: 149, protein: 9, carbs: 11, fat: 8, fiber: 0, sugar: 11, sodium: 115 },
  { id: 'f100', name: 'Kefir', serving: '1 cup', calories: 104, protein: 9, carbs: 12, fat: 2.5, fiber: 0, sugar: 12, sodium: 100 },
  { id: 'f101', name: 'Butter', serving: '1 tbsp', calories: 102, protein: 0.1, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 82 },
  { id: 'f102', name: 'Cream Cheese', serving: '2 tbsp', calories: 100, protein: 2, carbs: 2, fat: 10, fiber: 0, sugar: 1, sodium: 105 },
  { id: 'f103', name: 'Sour Cream', serving: '2 tbsp', calories: 60, protein: 1, carbs: 1, fat: 6, fiber: 0, sugar: 1, sodium: 15 },
  { id: 'f104', name: 'Mayonnaise', serving: '1 tbsp', calories: 94, protein: 0.1, carbs: 0.1, fat: 10, fiber: 0, sugar: 0.1, sodium: 88 },
  { id: 'f105', name: 'Mustard', serving: '1 tsp', calories: 3, protein: 0.2, carbs: 0.3, fat: 0.2, fiber: 0.1, sugar: 0, sodium: 55 },
  { id: 'f106', name: 'Ketchup', serving: '1 tbsp', calories: 17, protein: 0.3, carbs: 4, fat: 0, fiber: 0.1, sugar: 3.2, sodium: 154 },
  { id: 'f107', name: 'Soy Sauce', serving: '1 tbsp', calories: 8, protein: 1, carbs: 1, fat: 0, fiber: 0, sugar: 0.3, sodium: 902 },
  { id: 'f108', name: 'Salsa', serving: '2 tbsp', calories: 10, protein: 0.5, carbs: 2, fat: 0, fiber: 0.5, sugar: 1, sodium: 120 },
  { id: 'f109', name: 'Guacamole', serving: '2 tbsp', calories: 50, protein: 1, carbs: 3, fat: 4, fiber: 2, sugar: 0.3, sodium: 90 },
  { id: 'f110', name: 'Pesto', serving: '2 tbsp', calories: 160, protein: 4, carbs: 2, fat: 17, fiber: 0.5, sugar: 0.3, sodium: 320 },
  { id: 'f111', name: 'Rice Cakes', serving: '1 cake', calories: 35, protein: 0.7, carbs: 7, fat: 0.3, fiber: 0.4, sugar: 0.3, sodium: 29 },
  { id: 'f112', name: 'Crackers', serving: '5 crackers', calories: 80, protein: 1, carbs: 11, fat: 3.5, fiber: 0.5, sugar: 1, sodium: 140 },
  { id: 'f113', name: 'Popcorn', serving: '1 cup', calories: 31, protein: 1, carbs: 6, fat: 0.4, fiber: 1, sugar: 0.1, sodium: 1 },
  { id: 'f114', name: 'Pretzels', serving: '28g', calories: 108, protein: 3, carbs: 22, fat: 1, fiber: 1, sugar: 1, sodium: 385 },
  { id: 'f115', name: 'Chips (Potato)', serving: '28g', calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1, sugar: 0.2, sodium: 149 },
  { id: 'f116', name: 'Tortilla Chips', serving: '28g', calories: 140, protein: 2, carbs: 18, fat: 7, fiber: 1.5, sugar: 0.5, sodium: 115 },
  { id: 'f117', name: 'Granola', serving: '1/2 cup', calories: 212, protein: 5, carbs: 33, fat: 8, fiber: 4, sugar: 12, sodium: 20 },
  { id: 'f118', name: 'Cereal (Cheerios)', serving: '1 cup', calories: 100, protein: 3, carbs: 20, fat: 2, fiber: 3, sugar: 1, sodium: 140 },
  { id: 'f119', name: 'Cereal (Froot Loops)', serving: '1 cup', calories: 110, protein: 1, carbs: 25, fat: 1, fiber: 0.5, sugar: 12, sodium: 130 },
  { id: 'f120', name: 'Raisins', serving: '1/4 cup', calories: 108, protein: 1, carbs: 29, fat: 0.2, fiber: 1.5, sugar: 28, sodium: 4 },
  { id: 'f121', name: 'Dates', serving: '2 dates', calories: 140, protein: 1, carbs: 36, fat: 0.4, fiber: 4, sugar: 32, sodium: 0 },
  { id: 'f122', name: 'Figs', serving: '1/2 cup', calories: 110, protein: 1.4, carbs: 29, fat: 0.4, fiber: 4.5, sugar: 24, sodium: 1 },
  { id: 'f123', name: 'Prunes', serving: '5 prunes', calories: 114, protein: 1, carbs: 30, fat: 0.2, fiber: 3.4, sugar: 18, sodium: 2 },
  { id: 'f124', name: 'Dried Apricots', serving: '1/4 cup', calories: 78, protein: 1, carbs: 19, fat: 0.2, fiber: 2, sugar: 15, sodium: 2 },
  { id: 'f125', name: 'Coconut', serving: '28g', calories: 99, protein: 1, carbs: 4, fat: 9, fiber: 2.5, sugar: 1.6, sodium: 9 },
  { id: 'f126', name: 'Chia Seeds', serving: '28g', calories: 138, protein: 5, carbs: 12, fat: 9, fiber: 10, sugar: 0, sodium: 5 },
  { id: 'f127', name: 'Flax Seeds', serving: '1 tbsp', calories: 55, protein: 2, carbs: 3, fat: 4, fiber: 3, sugar: 0.2, sodium: 3 },
  { id: 'f128', name: 'Hemp Seeds', serving: '2 tbsp', calories: 111, protein: 6, carbs: 2, fat: 9, fiber: 1, sugar: 0.3, sodium: 1 },
  { id: 'f129', name: 'Pumpkin Seeds', serving: '28g', calories: 151, protein: 8, carbs: 5, fat: 13, fiber: 1.7, sugar: 0.4, sodium: 5 },
  { id: 'f130', name: 'Sunflower Seeds', serving: '28g', calories: 164, protein: 5.8, carbs: 6.5, fat: 14, fiber: 3, sugar: 0.8, sodium: 4 },
  { id: 'f131', name: 'Sesame Seeds', serving: '1 tbsp', calories: 52, protein: 1.6, carbs: 2, fat: 4.5, fiber: 1.1, sugar: 0, sodium: 1 },
  { id: 'f132', name: 'Cumin', serving: '1 tsp', calories: 8, protein: 0.4, carbs: 1, fat: 0.5, fiber: 0.2, sugar: 0, sodium: 2 },
  { id: 'f133', name: 'Cinnamon', serving: '1 tsp', calories: 6, protein: 0.1, carbs: 2, fat: 0, fiber: 1.2, sugar: 0, sodium: 0 },
  { id: 'f134', name: 'Turmeric', serving: '1 tsp', calories: 8, protein: 0.2, carbs: 1.7, fat: 0.2, fiber: 0.5, sugar: 0, sodium: 1 },
  { id: 'f135', name: 'Garlic', serving: '1 clove', calories: 4, protein: 0.2, carbs: 1, fat: 0, fiber: 0.1, sugar: 0, sodium: 1 },
  { id: 'f136', name: 'Ginger', serving: '1 tsp', calories: 2, protein: 0, carbs: 0.5, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  { id: 'f137', name: 'Lemon', serving: '1/2', calories: 9, protein: 0.3, carbs: 3, fat: 0.1, fiber: 0.9, sugar: 1.2, sodium: 1 },
  { id: 'f138', name: 'Lime', serving: '1/2', calories: 10, protein: 0.3, carbs: 3, fat: 0.1, fiber: 0.8, sugar: 0.5, sodium: 1 },
  { id: 'f139', name: 'Cilantro', serving: '1 tbsp', calories: 1, protein: 0.1, carbs: 0.1, fat: 0, fiber: 0, sugar: 0, sodium: 2 },
  { id: 'f140', name: 'Basil', serving: '1 tbsp', calories: 1, protein: 0.1, carbs: 0.1, fat: 0, fiber: 0.1, sugar: 0, sodium: 0 },
  { id: 'f141', name: 'Parsley', serving: '1 tbsp', calories: 1, protein: 0.1, carbs: 0.1, fat: 0, fiber: 0.1, sugar: 0, sodium: 2 },
  { id: 'f142', name: 'Mint', serving: '1 tbsp', calories: 1, protein: 0, carbs: 0.2, fat: 0, fiber: 0.1, sugar: 0, sodium: 0 },
  { id: 'f143', name: 'Lettuce', serving: '1 cup', calories: 5, protein: 0.5, carbs: 1, fat: 0.1, fiber: 0.5, sugar: 0.5, sodium: 3 },
  { id: 'f144', name: 'Arugula', serving: '1 cup', calories: 5, protein: 0.5, carbs: 0.7, fat: 0.1, fiber: 0.3, sugar: 0.2, sodium: 10 },
  { id: 'f145', name: 'Zucchini', serving: '1 cup', calories: 20, protein: 1.5, carbs: 4, fat: 0.3, fiber: 1.2, sugar: 2.5, sodium: 10 },
  { id: 'f146', name: 'Eggplant', serving: '1 cup', calories: 20, protein: 0.8, carbs: 5, fat: 0.1, fiber: 2.5, sugar: 3, sodium: 2 },
  { id: 'f147', name: 'Asparagus', serving: '1 cup', calories: 27, protein: 3, carbs: 5, fat: 0.2, fiber: 2.8, sugar: 1.9, sodium: 3 },
  { id: 'f148', name: 'Green Beans', serving: '1 cup', calories: 31, protein: 2, carbs: 7, fat: 0.2, fiber: 2.7, sugar: 1.4, sodium: 6 },
  { id: 'f149', name: 'Peas', serving: '1 cup', calories: 118, protein: 8, carbs: 21, fat: 0.6, fiber: 7, sugar: 8, sodium: 7 },
  { id: 'f150', name: 'Corn', serving: '1 cup', calories: 132, protein: 5, carbs: 29, fat: 2, fiber: 4, sugar: 6, sodium: 15 },
  { id: 'f151', name: 'Potato', serving: '1 medium', calories: 163, protein: 4.3, carbs: 37, fat: 0.2, fiber: 4, sugar: 1.2, sodium: 14 },
  { id: 'f152', name: 'Beets', serving: '1 cup', calories: 59, protein: 2.2, carbs: 13, fat: 0.2, fiber: 3.8, sugar: 9, sodium: 106 },
  { id: 'f153', name: 'Radish', serving: '1 cup', calories: 19, protein: 0.8, carbs: 4, fat: 0.1, fiber: 1.9, sugar: 2.2, sodium: 24 },
  { id: 'f154', name: 'Cauliflower', serving: '1 cup', calories: 25, protein: 2, carbs: 5, fat: 0.1, fiber: 2, sugar: 2.5, sodium: 30 },
  { id: 'f155', name: 'Brussels Sprouts', serving: '1 cup', calories: 38, protein: 3, carbs: 8, fat: 0.3, fiber: 3.3, sugar: 2, sodium: 22 },
  { id: 'f156', name: 'Cabbage', serving: '1 cup', calories: 22, protein: 1.1, carbs: 5, fat: 0.2, fiber: 2.2, sugar: 3, sodium: 16 },
  { id: 'f157', name: 'Celery', serving: '1 cup', calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, sugar: 1.8, sodium: 96 },
  { id: 'f158', name: 'Leek', serving: '1 cup', calories: 54, protein: 1.3, carbs: 13, fat: 0.3, fiber: 1.6, sugar: 3.6, sodium: 18 },
  { id: 'f159', name: 'Fennel', serving: '1 cup', calories: 27, protein: 1.3, carbs: 6, fat: 0.2, fiber: 2.7, sugar: 3, sodium: 45 },
  { id: 'f160', name: 'Artichoke', serving: '1 medium', calories: 60, protein: 4, carbs: 14, fat: 0.2, fiber: 7, sugar: 1, sodium: 120 },
  { id: 'f161', name: 'Okra', serving: '1 cup', calories: 33, protein: 2, carbs: 7, fat: 0.2, fiber: 3, sugar: 1.5, sodium: 8 },
  { id: 'f162', name: 'Bok Choy', serving: '1 cup', calories: 9, protein: 1, carbs: 1.5, fat: 0.1, fiber: 0.7, sugar: 0.8, sodium: 46 },
  { id: 'f163', name: 'Watercress', serving: '1 cup', calories: 4, protein: 0.8, carbs: 0.4, fat: 0, fiber: 0.2, sugar: 0.1, sodium: 14 },
  { id: 'f164', name: 'Swiss Chard', serving: '1 cup', calories: 7, protein: 0.7, carbs: 1.1, fat: 0.1, fiber: 0.6, sugar: 0.3, sodium: 77 },
  { id: 'f165', name: 'Collard Greens', serving: '1 cup', calories: 11, protein: 1, carbs: 2, fat: 0.2, fiber: 1.4, sugar: 0.2, sodium: 17 },
  { id: 'f166', name: 'Turnip', serving: '1 cup', calories: 36, protein: 1.2, carbs: 8, fat: 0.1, fiber: 2.3, sugar: 4.6, sodium: 41 },
  { id: 'f167', name: 'Parsnip', serving: '1 cup', calories: 100, protein: 1.6, carbs: 24, fat: 0.4, fiber: 6.5, sugar: 8, sodium: 13 },
  { id: 'f168', name: 'Rutabaga', serving: '1 cup', calories: 51, protein: 1.7, carbs: 12, fat: 0.3, fiber: 3, sugar: 7, sodium: 24 },
  { id: 'f169', name: 'Butternut Squash', serving: '1 cup', calories: 82, protein: 1.8, carbs: 22, fat: 0.2, fiber: 6.6, sugar: 4, sodium: 8 },
  { id: 'f170', name: 'Spaghetti Squash', serving: '1 cup', calories: 31, protein: 0.6, carbs: 7, fat: 0.6, fiber: 1.5, sugar: 2.8, sodium: 17 },
  { id: 'f171', name: 'Acorn Squash', serving: '1 cup', calories: 115, protein: 2.3, carbs: 30, fat: 0.3, fiber: 9, sugar: 9, sodium: 8 },
  { id: 'f172', name: 'Pumpkin', serving: '1 cup', calories: 49, protein: 1.8, carbs: 12, fat: 0.2, fiber: 2.7, sugar: 5, sodium: 2 },
  { id: 'f173', name: 'Yam', serving: '1 cup', calories: 158, protein: 2, carbs: 37, fat: 0.3, fiber: 5, sugar: 0.7, sodium: 12 },
  { id: 'f174', name: 'Plantain', serving: '1 medium', calories: 220, protein: 2, carbs: 57, fat: 0.5, fiber: 4, sugar: 27, sodium: 6 },
  { id: 'f175', name: 'Taro', serving: '1 cup', calories: 187, protein: 0.7, carbs: 46, fat: 0.2, fiber: 6.7, sugar: 0.5, sodium: 20 },
  { id: 'f176', name: 'Cassava', serving: '1 cup', calories: 330, protein: 2.8, carbs: 78, fat: 0.6, fiber: 3.7, sugar: 3.5, sodium: 20 },
  { id: 'f177', name: 'Buckwheat', serving: '1 cup cooked', calories: 155, protein: 6, carbs: 33, fat: 1, fiber: 4.5, sugar: 1.5, sodium: 7 },
  { id: 'f178', name: 'Millet', serving: '1 cup cooked', calories: 207, protein: 6, carbs: 41, fat: 1.7, fiber: 2.3, sugar: 0.3, sodium: 3 },
  { id: 'f179', name: 'Amaranth', serving: '1 cup cooked', calories: 251, protein: 9, carbs: 46, fat: 4, fiber: 5, sugar: 3, sodium: 15 },
  { id: 'f180', name: 'Barley', serving: '1 cup cooked', calories: 193, protein: 3.5, carbs: 44, fat: 0.6, fiber: 6, sugar: 0.4, sodium: 3 },
  { id: 'f181', name: 'Bulgur', serving: '1 cup cooked', calories: 151, protein: 6, carbs: 34, fat: 0.4, fiber: 8, sugar: 0.2, sodium: 9 },
  { id: 'f182', name: 'Farro', serving: '1 cup cooked', calories: 220, protein: 8, carbs: 47, fat: 2, fiber: 5, sugar: 0.5, sodium: 5 },
  { id: 'f183', name: 'Couscous', serving: '1 cup cooked', calories: 176, protein: 6, carbs: 36, fat: 0.2, fiber: 2, sugar: 0.3, sodium: 8 },
  { id: 'f184', name: 'Polenta', serving: '1 cup', calories: 160, protein: 3, carbs: 34, fat: 1, fiber: 1, sugar: 1, sodium: 140 },
  { id: 'f185', name: 'Risotto', serving: '1 cup', calories: 280, protein: 7, carbs: 45, fat: 8, fiber: 1, sugar: 2, sodium: 600 },
  { id: 'f186', name: 'Paella', serving: '1 cup', calories: 350, protein: 15, carbs: 45, fat: 10, fiber: 2, sugar: 2, sodium: 800 },
  { id: 'f187', name: 'Stir Fry', serving: '1 cup', calories: 230, protein: 15, carbs: 20, fat: 9, fiber: 3, sugar: 5, sodium: 600 },
  { id: 'f188', name: 'Curry (Chicken)', serving: '1 cup', calories: 290, protein: 20, carbs: 12, fat: 18, fiber: 2, sugar: 4, sodium: 700 },
  { id: 'f189', name: 'Pad Thai', serving: '1 cup', calories: 380, protein: 15, carbs: 50, fat: 14, fiber: 3, sugar: 12, sodium: 900 },
  { id: 'f190', name: 'Pho', serving: '1 bowl', calories: 350, protein: 20, carbs: 40, fat: 10, fiber: 2, sugar: 3, sodium: 1000 },
  { id: 'f191', name: 'Ramen', serving: '1 pack', calories: 380, protein: 10, carbs: 54, fat: 14, fiber: 2, sugar: 3, sodium: 1660 },
  { id: 'f192', name: 'Dumplings', serving: '5 pieces', calories: 210, protein: 8, carbs: 28, fat: 7, fiber: 1, sugar: 1, sodium: 450 },
  { id: 'f193', name: 'Spring Roll', serving: '1 roll', calories: 120, protein: 3, carbs: 18, fat: 4, fiber: 1.5, sugar: 1, sodium: 280 },
  { id: 'f194', name: 'Egg Roll', serving: '1 roll', calories: 180, protein: 5, carbs: 20, fat: 9, fiber: 1.5, sugar: 2, sodium: 380 },
  { id: 'f195', name: 'Fried Rice', serving: '1 cup', calories: 333, protein: 12, carbs: 42, fat: 12, fiber: 2, sugar: 3, sodium: 600 },
  { id: 'f196', name: 'Lo Mein', serving: '1 cup', calories: 310, protein: 10, carbs: 45, fat: 10, fiber: 2, sugar: 4, sodium: 700 },
  { id: 'f197', name: 'Chow Mein', serving: '1 cup', calories: 240, protein: 8, carbs: 30, fat: 10, fiber: 2, sugar: 3, sodium: 550 },
  { id: 'f198', name: 'Lasagna', serving: '1 piece', calories: 380, protein: 20, carbs: 35, fat: 18, fiber: 3, sugar: 6, sodium: 800 },
  { id: 'f199', name: 'Ravioli', serving: '1 cup', calories: 350, protein: 15, carbs: 45, fat: 12, fiber: 3, sugar: 4, sodium: 700 },
  { id: 'f200', name: 'Mac and Cheese', serving: '1 cup', calories: 380, protein: 15, carbs: 45, fat: 16, fiber: 2, sugar: 6, sodium: 900 },
  { id: 'f201', name: 'Chili', serving: '1 cup', calories: 280, protein: 20, carbs: 30, fat: 10, fiber: 8, sugar: 6, sodium: 800 },
  { id: 'f202', name: 'Meatloaf', serving: '1 slice', calories: 290, protein: 25, carbs: 15, fat: 15, fiber: 1, sugar: 5, sodium: 600 },
  { id: 'f203', name: 'Shepherd Pie', serving: '1 cup', calories: 350, protein: 18, carbs: 35, fat: 15, fiber: 3, sugar: 4, sodium: 700 },
  { id: 'f204', name: 'Fajitas', serving: '1 serving', calories: 400, protein: 25, carbs: 40, fat: 15, fiber: 4, sugar: 5, sodium: 800 },
  { id: 'f205', name: 'Enchiladas', serving: '1 serving', calories: 380, protein: 20, carbs: 40, fat: 15, fiber: 4, sugar: 4, sodium: 900 },
];

// 50 motivational quotes
export const QUOTES = [
  'The body achieves what the mind believes.',
  'Push harder than yesterday if you want a different tomorrow.',
  'Your only limit is you.',
  'Sweat is just fat crying.',
  'The pain you feel today will be the strength you feel tomorrow.',
  'Don\'t wish for it, work for it.',
  'Success isn\'t given, it\'s earned in the gym and the kitchen.',
  'Take care of your body, it\'s the only place you have to live.',
  'The only bad workout is the one that didn\'t happen.',
  'Strive for progress, not perfection.',
  'You don\'t have to be extreme, just consistent.',
  'A year from now you\'ll wish you started today.',
  'The hardest lift is lifting your butt off the couch.',
  'Fall in love with the process and the results will come.',
  'Strength does not come from winning. It comes from struggle.',
  'What seems impossible today will one day become your warm-up.',
  'Your body can stand almost anything. It\'s your mind you have to convince.',
  'Discipline is choosing between what you want now and what you want most.',
  'The gym is my therapy, and my muscles are my masterpiece.',
  'If it doesn\'t challenge you, it doesn\'t change you.',
  'Wellness is the natural state of the body. Keep it that way.',
  'Health is not about the weight you lose, but the life you gain.',
  'Small changes make big results.',
  'Be stronger than your excuses.',
  'You are what you repeatedly do. Excellence is a habit.',
  'The difference between try and triumph is a little umph.',
  'Motivation gets you going, discipline keeps you growing.',
  'Today\'s choices shape tomorrow\'s body.',
  'Invest in yourself. Your body is your greatest asset.',
  'Every workout is a small win that adds up to big results.',
  'Rest days are for recovery, not for quitting.',
  'Your health is an investment, not an expense.',
  'The best project you\'ll ever work on is you.',
  'Don\'t stop when you\'re tired, stop when you\'re done.',
  'Champions train, losers complain.',
  'Wake up with determination, go to bed with satisfaction.',
  'The only way to finish is to start.',
  'Your body hears everything your mind says.',
  'Fitness is not about being better than someone else, it\'s about being better than you used to be.',
  'Eat for the body you want, not the body you have.',
  'Consistency over intensity, always.',
  'The mirror is a reflection of your habits.',
  'Strong is the new beautiful.',
  'You don\'t get the body you want by wanting it.',
  'Every rep counts. Every meal matters. Every day is progress.',
  'The pain of discipline weighs ounces, the pain of regret weighs tons.',
  'Make yourself proud today.',
  'Your future self is watching you right now through your memories.',
  'Great bodies are built in the kitchen and sculpted in the gym.',
  'The only person you are destined to become is the person you decide to be.',
];

// Pre-built workout plans
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  days: number;
  split: { day: string; focus: string; exercises: string[] }[];
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'ppl',
    name: 'Push Pull Legs',
    description: '6-day split for maximum hypertrophy',
    days: 6,
    split: [
      { day: 'Push', focus: 'Chest, Shoulders, Triceps', exercises: ['ex1', 'ex19', 'ex21', 'ex46', 'ex47'] },
      { day: 'Pull', focus: 'Back, Biceps', exercises: ['ex10', 'ex11', 'ex12', 'ex41', 'ex42'] },
      { day: 'Legs', focus: 'Quads, Hamstrings, Glutes', exercises: ['ex26', 'ex30', 'ex28', 'ex31', 'ex33'] },
      { day: 'Push', focus: 'Chest, Shoulders, Triceps', exercises: ['ex2', 'ex20', 'ex22', 'ex48', 'ex49'] },
      { day: 'Pull', focus: 'Back, Biceps', exercises: ['ex9', 'ex13', 'ex16', 'ex43', 'ex44'] },
      { day: 'Legs', focus: 'Quads, Hamstrings, Calves', exercises: ['ex27', 'ex34', 'ex35', 'ex32', 'ex106'] },
    ],
  },
  {
    id: 'fullbody',
    name: 'Full Body',
    description: '3-day split for beginners and intermediates',
    days: 3,
    split: [
      { day: 'Full Body A', focus: 'All major muscle groups', exercises: ['ex26', 'ex1', 'ex11', 'ex19', 'ex41'] },
      { day: 'Full Body B', focus: 'All major muscle groups', exercises: ['ex10', 'ex2', 'ex12', 'ex20', 'ex46'] },
      { day: 'Full Body C', focus: 'All major muscle groups', exercises: ['ex27', 'ex3', 'ex13', 'ex21', 'ex42'] },
    ],
  },
  {
    id: 'hiit',
    name: 'HIIT',
    description: '4-day high-intensity interval training',
    days: 4,
    split: [
      { day: 'HIIT Cardio', focus: 'Full body conditioning', exercises: ['ex65', 'ex64', 'ex70', 'ex55'] },
      { day: 'Strength HIIT', focus: 'Strength + cardio', exercises: ['ex72', 'ex73', 'ex65', 'ex66'] },
      { day: 'Core HIIT', focus: 'Core + cardio', exercises: ['ex51', 'ex53', 'ex55', 'ex64'] },
      { day: 'Full HIIT', focus: 'Full body burn', exercises: ['ex65', 'ex72', 'ex70', 'ex66'] },
    ],
  },
  {
    id: 'beginner',
    name: 'Beginner',
    description: '3-day beginner-friendly plan',
    days: 3,
    split: [
      { day: 'Beginner A', focus: 'Foundational movements', exercises: ['ex3', 'ex26', 'ex41', 'ex51'] },
      { day: 'Beginner B', focus: 'Foundational movements', exercises: ['ex12', 'ex36', 'ex46', 'ex52'] },
      { day: 'Beginner C', focus: 'Foundational movements', exercises: ['ex29', 'ex20', 'ex42', 'ex54'] },
    ],
  },
];

// Pre-built meal plans
export interface MealPlan {
  id: string;
  name: string;
  description: string;
  type: string;
  dailyCalories: number;
  days: { day: string; meals: { name: string; foods: string[] }[] }[];
}

export const MEAL_PLANS: MealPlan[] = [
  {
    id: 'cutting',
    name: 'Cutting',
    description: 'Calorie deficit for fat loss',
    type: 'Deficit',
    dailyCalories: 1800,
    days: [
      { day: 'Day 1', meals: [
        { name: 'Breakfast', foods: ['f7', 'f8', 'f6'] },
        { name: 'Lunch', foods: ['f1', 'f2', 'f11'] },
        { name: 'Dinner', foods: ['f4', 'f22', 'f23'] },
        { name: 'Snack', foods: ['f41', 'f44'] },
      ]},
      { day: 'Day 2', meals: [
        { name: 'Breakfast', foods: ['f5', 'f7', 'f9'] },
        { name: 'Lunch', foods: ['f14', 'f19', 'f24'] },
        { name: 'Dinner', foods: ['f15', 'f2', 'f11'] },
        { name: 'Snack', foods: ['f39', 'f45'] },
      ]},
    ],
  },
  {
    id: 'bulking',
    name: 'Bulking',
    description: 'Calorie surplus for muscle gain',
    type: 'Surplus',
    dailyCalories: 3000,
    days: [
      { day: 'Day 1', meals: [
        { name: 'Breakfast', foods: ['f5', 'f7', 'f8', 'f34', 'f117'] },
        { name: 'Lunch', foods: ['f15', 'f33', 'f11', 'f38'] },
        { name: 'Dinner', foods: ['f4', 'f2', 'f13', 'f11'] },
        { name: 'Snack', foods: ['f42', 'f50', 'f8'] },
      ]},
      { day: 'Day 2', meals: [
        { name: 'Breakfast', foods: ['f96', 'f91', 'f13'] },
        { name: 'Lunch', foods: ['f73', 'f33', 'f38', 'f11'] },
        { name: 'Dinner', foods: ['f1', 'f12', 'f13', 'f149'] },
        { name: 'Snack', foods: ['f41', 'f34', 'f117'] },
      ]},
    ],
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Balanced calories to maintain weight',
    type: 'Maintenance',
    dailyCalories: 2400,
    days: [
      { day: 'Day 1', meals: [
        { name: 'Breakfast', foods: ['f7', 'f8', 'f6'] },
        { name: 'Lunch', foods: ['f1', 'f2', 'f11', 'f13'] },
        { name: 'Dinner', foods: ['f4', 'f22', 'f24'] },
        { name: 'Snack', foods: ['f10', 'f9'] },
      ]},
    ],
  },
  {
    id: 'keto',
    name: 'Keto',
    description: 'Low carb, high fat',
    type: 'Ketogenic',
    dailyCalories: 2000,
    days: [
      { day: 'Day 1', meals: [
        { name: 'Breakfast', foods: ['f5', 'f13', 'f38'] },
        { name: 'Lunch', foods: ['f1', 'f11', 'f13', 'f35'] },
        { name: 'Dinner', foods: ['f15', 'f11', 'f13', 'f35'] },
        { name: 'Snack', foods: ['f50', 'f41'] },
      ]},
    ],
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'Plant-based balanced nutrition',
    type: 'Vegetarian',
    dailyCalories: 2200,
    days: [
      { day: 'Day 1', meals: [
        { name: 'Breakfast', foods: ['f7', 'f8', 'f6', 'f34'] },
        { name: 'Lunch', foods: ['f18', 'f19', 'f22', 'f11'] },
        { name: 'Dinner', foods: ['f86', 'f2', 'f11', 'f13'] },
        { name: 'Snack', foods: ['f39', 'f45'] },
      ]},
    ],
  },
];

// 30 achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'First Step', description: 'Log your first workout', icon: 'Footprints', tier: 'bronze' },
  { id: 'a2', name: 'Getting Started', description: 'Complete 5 workouts', icon: 'TrendingUp', tier: 'bronze' },
  { id: 'a3', name: 'Consistent', description: 'Complete 10 workouts', icon: 'Calendar', tier: 'silver' },
  { id: 'a4', name: 'Dedicated', description: 'Complete 25 workouts', icon: 'Dumbbell', tier: 'silver' },
  { id: 'a5', name: 'Centurion', description: 'Complete 100 workouts', icon: 'Trophy', tier: 'gold' },
  { id: 'a6', name: 'Iron Will', description: '7-day streak', icon: 'Flame', tier: 'silver' },
  { id: 'a7', name: 'Unstoppable', description: '14-day streak', icon: 'Zap', tier: 'gold' },
  { id: 'a8', name: 'Relentless', description: '30-day streak', icon: 'Crown', tier: 'platinum' },
  { id: 'a9', name: 'Hydration Hero', description: 'Hit water goal 14 days in a row', icon: 'Droplet', tier: 'gold' },
  { id: 'a10', name: 'Water Lover', description: 'Hit water goal 7 days in a row', icon: 'Droplets', tier: 'silver' },
  { id: 'a11', name: 'PR Machine', description: 'Break 10 personal records', icon: 'Medal', tier: 'gold' },
  { id: 'a12', name: 'Record Breaker', description: 'Break your first PR', icon: 'Award', tier: 'bronze' },
  { id: 'a13', name: 'Macro Master', description: 'Hit macro targets 7 days in a row', icon: 'Target', tier: 'gold' },
  { id: 'a14', name: 'Nutrition Pro', description: 'Log all meals for 7 days', icon: 'Apple', tier: 'silver' },
  { id: 'a15', name: 'Early Bird', description: 'Log workout before 8am (5 times)', icon: 'Sunrise', tier: 'silver' },
  { id: 'a16', name: 'Night Owl', description: 'Log workout after 9pm (5 times)', icon: 'Moon', tier: 'silver' },
  { id: 'a17', name: 'Level 5', description: 'Reach level 5', icon: 'Star', tier: 'bronze' },
  { id: 'a18', name: 'Level 10', description: 'Reach level 10', icon: 'Star', tier: 'silver' },
  { id: 'a19', name: 'Level 15', description: 'Reach level 15', icon: 'Star', tier: 'gold' },
  { id: 'a20', name: 'Max Level', description: 'Reach level 20', icon: 'Crown', tier: 'platinum' },
  { id: 'a21', name: 'XP Hunter', description: 'Earn 1000 XP total', icon: 'Sparkles', tier: 'bronze' },
  { id: 'a22', name: 'XP Master', description: 'Earn 5000 XP total', icon: 'Sparkles', tier: 'gold' },
  { id: 'a23', name: 'Weight Tracker', description: 'Log weight 10 times', icon: 'Scale', tier: 'bronze' },
  { id: 'a24', name: 'Body Transformer', description: 'Lose or gain 5kg toward goal', icon: 'TrendingDown', tier: 'gold' },
  { id: 'a25', name: 'Workout Builder', description: 'Create a custom workout', icon: 'Wrench', tier: 'bronze' },
  { id: 'a26', name: 'Plan Follower', description: 'Complete a full workout plan week', icon: 'ListChecks', tier: 'silver' },
  { id: 'a27', name: 'AI Explorer', description: 'Chat with AI Coach 10 times', icon: 'Bot', tier: 'silver' },
  { id: 'a28', name: 'Sleep Tracker', description: 'Log sleep 7 times', icon: 'Bed', tier: 'bronze' },
  { id: 'a29', name: 'Recovery Pro', description: 'Maintain recovery score above 80 for 7 days', icon: 'HeartPulse', tier: 'gold' },
  { id: 'a30', name: 'Vitora Legend', description: 'Earn all other achievements', icon: 'Crown', tier: 'platinum' },
];

// Level system
export const LEVELS = [
  { name: 'Beginner', minXp: 0 },
  { name: 'Novice', minXp: 500 },
  { name: 'Apprentice', minXp: 1000 },
  { name: 'Adept', minXp: 1500 },
  { name: 'Warrior', minXp: 2000 },
  { name: 'Athlete', minXp: 2500 },
  { name: 'Competitor', minXp: 3000 },
  { name: 'Fighter', minXp: 3500 },
  { name: 'Champion', minXp: 4500 },
  { name: 'Expert', minXp: 5000 },
  { name: 'Master', minXp: 5500 },
  { name: 'Veteran', minXp: 6000 },
  { name: 'Elite', minXp: 6500 },
  { name: 'Pro', minXp: 7000 },
  { name: 'All-Star', minXp: 7500 },
  { name: 'Superstar', minXp: 8000 },
  { id: 'a17', name: 'Hero', minXp: 8500 },
  { name: 'Icon', minXp: 9000 },
  { name: 'Legend', minXp: 9500 },
  { name: 'Mythic', minXp: 10000 },
];

export function getLevel(xp: number) {
  let level = 1;
  let levelName = 'Beginner';
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      level = i + 1;
      levelName = LEVELS[i].name;
    }
  }
  const currentMin = LEVELS[level - 1].minXp;
  const nextMin = level < LEVELS.length ? LEVELS[level].minXp : LEVELS[LEVELS.length - 1].minXp;
  const progress = level < LEVELS.length ? (xp - currentMin) / (nextMin - currentMin) : 1;
  return { level, levelName, progress, currentMin, nextMin };
}

// Muscle group colors for SVG diagram
export const MUSCLE_COLORS: Record<string, string> = {
  Chest: '#ef4444',
  Back: '#3b82f6',
  Shoulders: '#f59e0b',
  Biceps: '#10b981',
  Triceps: '#06b6d4',
  Quads: '#8b5cf6',
  Hamstrings: '#ec4899',
  Glutes: '#f97316',
  Calves: '#14b8a6',
  Core: '#eab308',
  Forearms: '#a855f7',
  Traps: '#6366f1',
  Cardio: '#22c55e',
  Full: '#10b981',
};

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dateStr(d);
}

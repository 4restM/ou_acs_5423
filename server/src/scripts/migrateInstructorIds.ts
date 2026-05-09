import mongoose from 'mongoose';
import Instructor from '../models/Instructor';

export async function migrateInstructorIds(): Promise<void> {
  const missing = await Instructor.find({ instructorId: { $exists: false } }).sort({
    createdAt: 1,
  });

  if (missing.length === 0) return;

  const existing = await Instructor.find({ instructorId: { $exists: true } })
    .select('instructorId')
    .lean();

  const maxNum = existing.reduce((max, inst) => {
    const num = parseInt((inst.instructorId as string).slice(1), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);

  let next = maxNum;
  for (const inst of missing) {
    next++;
    inst.instructorId = `I${String(next).padStart(5, '0')}`;
    await inst.save();
  }

  console.info(`[migration] Backfilled instructorId for ${missing.length} instructor(s)`);
}

// Allow running directly: tsx src/scripts/migrateInstructorIds.ts
if (require.main === module) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  mongoose
    .connect(uri)
    .then(() => migrateInstructorIds())
    .then(() => mongoose.disconnect())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

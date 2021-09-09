import Rand from 'rand-seed';

/** string seed that is static for a specific period of time */
export const getSeed = (subseed = ''): string => {
  const seedPeriodInSeconds = 60 * 5;
  const seed = Math.floor(Date.now() / 1000 / seedPeriodInSeconds);
  return `${seed}${subseed}`;
};

/** sample `count` items from an array */
export const sample = <T>(items: T[], count: number, seed = getSeed()): T[] => {
  const ret: T[] = [];

  const rand = new Rand(seed);
  const buffer = [...items];

  let toTake = count;

  while (toTake-- > 0 && buffer.length > 0) {
    const index = Math.floor(buffer.length * rand.next());
    ret.push(buffer[index]);
    buffer.splice(index, 1);
  }

  return ret;
};

export const shuffle = <T>(items: T[], seed = getSeed()): T[] => sample(items, items.length, seed);

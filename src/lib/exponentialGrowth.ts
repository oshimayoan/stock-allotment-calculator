import { LOT_SIZE } from '@/constants';

export const a1 = 1.63; // magic number
export const e = 2.71828; // euler's number
export const k = 0.5; // magic number

export function getNormalizedValues(totalTicks: number) {
  const normalizedValues: number[] = [];

  for (let i = 0; i < totalTicks; i++) {
    normalizedValues.push(a1 * e ** (k * (i - 1)));
  }

  return normalizedValues;
}

export function getAllotedCashes(
  normalizedValues: number[],
  totalCash: number
) {
  const sumOfNormalizedValues = normalizedValues.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const allotedCashes: number[] = [];

  for (let i = 0; i < normalizedValues.length; i++) {
    allotedCashes.push(
      (normalizedValues[i] * totalCash) / sumOfNormalizedValues
    );
  }

  return allotedCashes;
}

export function getAllotedLots(
  allotedCashes: number[],
  priceList: number[],
  lotSize = LOT_SIZE
) {
  const allotedLots: { [key: number]: number } = {};

  for (let i = 0; i < allotedCashes.length; i++) {
    const price = priceList[i];
    const lot = allotedCashes[i] / (price * lotSize);
    allotedLots[price] = Math.floor(lot);
  }

  return allotedLots;
}

export function getCumulativeAverage(
  allotedLots: { [key: number]: number },
  priceList: number[]
) {
  const allotedLotsArr = Object.values(allotedLots)
    .sort((a, b) => a - b)
    .slice(0, priceList.length);

  const cumulativeLots = allotedLotsArr.reduce((acc, curr) => acc + curr, 0);

  const cumulativeAverage =
    priceList.reduce((acc, curr) => acc + curr * allotedLots[curr], 0) /
    cumulativeLots;

  return cumulativeAverage;
}

export function getPurchases(
  allotedLots: { [key: number]: number },
  priceList: number[],
  totalCash: number,
  lotSize = LOT_SIZE
) {
  const purchases: {
    [key: number]: {
      total: number;
      average: number;
      lot: number;
      percentage: number;
    };
  } = {};
  let totalSum = 0;
  let currentAverage = 0;

  priceList.forEach((price, index) => {
    const total = allotedLots[price] * lotSize * price;
    totalSum += total;

    const cumulativeAverage = getCumulativeAverage(
      allotedLots,
      priceList.slice(0, index + 1)
    );

    currentAverage = cumulativeAverage;

    purchases[price] = {
      total,
      average: currentAverage,
      lot: allotedLots[price],
      percentage: total / totalCash,
    };
  });

  return { purchases, totalSum, finalAverage: currentAverage };
}

export function calculateExponentialGrowthAllotment(
  totalCash: number,
  priceList: number[]
) {
  const normalizedValues = getNormalizedValues(priceList.length);
  const allotedCashes = getAllotedCashes(normalizedValues, totalCash);
  const allotedLots = getAllotedLots(allotedCashes, priceList);
  const result = getPurchases(allotedLots, priceList, totalCash);

  return result;
}

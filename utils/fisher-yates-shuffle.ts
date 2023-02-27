// Fisher Yates Shuffle
export function swap(
  array: { [x: string]: any },
  i: string | number,
  j: number
) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

export function shuffleCards(array: any[]) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    swap(array, currentIndex, randomIndex);
  }
  return array;
}

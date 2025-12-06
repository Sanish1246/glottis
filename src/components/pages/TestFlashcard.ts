import dayjs from 'dayjs';
import { supermemo, type SuperMemoItem, type SuperMemoGrade } from 'supermemo';

interface Flashcard extends SuperMemoItem {
  front: string;
  back: string;
  dueDate: string;
}

function practice(flashcard: Flashcard, grade: SuperMemoGrade): Flashcard {
  const { interval, repetition, efactor } = supermemo(flashcard, grade);


const dueDate = dayjs(Date.now())
  .add(interval, 'day')
  .format('DD-MM-YYYY');
  

  return { ...flashcard, interval, repetition, efactor, dueDate };
}

// const today = new Date();
// const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
//   today.getMonth() + 1
// )
//   .toString()
//   .padStart(2, "0")}/${today.getFullYear()}`;

let flashcard: Flashcard = {
  front: 'programmer',
  back: 'an organism that turns caffeine in software',
  interval: 0,
  repetition: 0,
  efactor: 2.5,
  dueDate: dayjs(Date.now())
  .format('DD-MM-YYYY'),
};

console.log(flashcard);

flashcard = practice(flashcard, 5);
console.log(flashcard);

flashcard = practice(flashcard, 3);
console.log(flashcard);
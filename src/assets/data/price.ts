type PriceContinents = {
   id: number;
   text: string;
   array: number[];
}[];

const price: Record<string, PriceContinents> = {
   'dien-thoai': [
      {
         id: 1,
         text: "Tất cả",
         array: [],
      },
      {
         id: 2,
         text: "Dưới 3 triệu",
         array: [0, 3],
      },
      {
         id: 3,
         text: "Từ 3 - 7 triệu",
         array: [3, 7],
      },
      {
         id: 4,
         text: "Từ 7 - 13 triệu",
         array: [7, 13],
      },
      {
         id: 5,
         text: "Trên 13 triệu",
         array: [13, 50],
      },
   ],
   'laptop': [
      {
         id: 1,
         text: "Tất cả",
         array: [],
      },
      {
         id: 2,
         text: "Dưới 10 triệu",
         array: [0, 10],
      },
      {
         id: 3,
         text: "Từ 10 - 15 triệu",
         array: [10, 15],
      },
      {
         id: 4,
         text: "Từ 15 - 20 triệu",
         array: [15, 20],
      },
      {
         id: 5,
         text: "Trên 20 triệu",
         array: [20, 50],
      },
   ],
};

export { price };

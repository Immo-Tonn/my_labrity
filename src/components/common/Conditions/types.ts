export type Condition = {
  _id: string;
  title: string;
  description: {
    children: {
      text: string;
    }[];
  }[];
};

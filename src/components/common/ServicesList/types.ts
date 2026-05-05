export type Cards = {
  subtitle: string;
  description: string;
};

export type Service = {
  _id: string;
  title: string;
  location: string;
  card: Cards[];
};

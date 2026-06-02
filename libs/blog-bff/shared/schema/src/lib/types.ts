import { articles, authors } from './schema';

export type NewArticle = typeof articles.$inferInsert;
export type NewAuthor = typeof authors.$inferInsert;

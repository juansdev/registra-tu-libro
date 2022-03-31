export class Book{
  constructor(
    public _id:string,
    public title: string,
    public year: string,
    public gender: string,
    public pages: number,
    public author_id: string,
    public editorial_id: string
  ){}
}

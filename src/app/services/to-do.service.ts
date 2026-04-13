// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { ToDo } from '../Models/to-do';

// @Injectable({
//   providedIn: 'root'
// })
// export class ToDoService {
//   private apiUrl='http://localhost:3000/todos';

//   constructor(private http:HttpClient) { }
//   getTodos() : Observable<ToDo[]>
//   {
//     return this.http.get<ToDo[]>(this.apiUrl);
//   }
//   creatTodo(todo:ToDo) : Observable<ToDo>
//   {
//     return this.http.post<ToDo>(this.apiUrl,todo);
//   }
//   getTodosById(id:string):Observable<ToDo>
//   {
//     return this.http.get<ToDo>(`${this.apiUrl}/${id}`);
//   }
//   updateTodos(todo:ToDo):Observable<ToDo>
//   {
//     return this.http.put<ToDo>(`${this.apiUrl}/${todo.id}`,todo);
//   }
//    deleteTodos(id:string):Observable<void>
//   {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }

// }

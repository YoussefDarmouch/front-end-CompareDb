// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { ToDo } from 'src/app/Models/to-do';
// import { ToDoService } from '../../services/to-do.service';
// import { FormsModule } from '@angular/forms';
// @Component({
//   selector: 'app-todos',
//   standalone: true,
//   imports: [RouterModule,FormsModule],
//   templateUrl: './todos.component.html',
//   styleUrl: './todos.component.css'
// })
// export class TodosComponent {
//   todos : ToDo[]=[];
//   newtodo : ToDo= {}as ToDo;
//   constructor(private todoService:ToDoService){}
//   ngOnInit():void{
//     this.getToDos();
//   }
//   getToDos(){
//     this.todoService.getTodos().subscribe(T=>{
//       this.todos=T
//     })
//   }
//   creatToDo():void{
//     const newtodo1={id:this.newtodo.id,title:this.newtodo.title,completed:false};

//     this.newtodo= newtodo1; 
//     this.todoService.creatTodo(newtodo1).subscribe((todo)=>{
//       this.todos.push(todo);
//     })
    
//   }
//   deleteToDo(id:string):void{

//     this.todoService.deleteTodos(id).subscribe(()=>{
//       this.todos.filter((t)=>t.id!==id);
//     });
//   }
//   updateTodo(todo:ToDo):void{

//     this.todoService.deleteTodos(todo.id).subscribe(()=>{
//       this.todos.filter((t)=>t.id==todo.id?todo:t);
//     });
//   }

// }

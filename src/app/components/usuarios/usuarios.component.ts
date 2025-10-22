import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaRegistro: Date;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  
  displayedColumns: string[] = ['nombre', 'email', 'rol', 'activo', 'fechaRegistro', 'acciones'];
  
  usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      rol: 'Administrador',
      activo: true,
      fechaRegistro: new Date('2024-01-15')
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria.garcia@email.com',
      rol: 'Editor',
      activo: true,
      fechaRegistro: new Date('2024-02-20')
    },
    {
      id: 3,
      nombre: 'Carlos López',
      email: 'carlos.lopez@email.com',
      rol: 'Usuario',
      activo: false,
      fechaRegistro: new Date('2024-03-10')
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      rol: 'Editor',
      activo: true,
      fechaRegistro: new Date('2024-03-25')
    },
    {
      id: 5,
      nombre: 'Pedro Rodríguez',
      email: 'pedro.rodriguez@email.com',
      rol: 'Usuario',
      activo: true,
      fechaRegistro: new Date('2024-04-05')
    }
  ];

  ngOnInit() {}

  editarUsuario(usuario: Usuario) {
    console.log('Editar usuario:', usuario);
    // Implementar lógica de edición
  }

  eliminarUsuario(usuario: Usuario) {
    console.log('Eliminar usuario:', usuario);
    // Implementar lógica de eliminación
  }

  toggleActivo(usuario: Usuario) {
    usuario.activo = !usuario.activo;
    console.log('Toggle activo:', usuario);
    // Implementar lógica de actualización
  }

  agregarUsuario() {
    console.log('Agregar nuevo usuario');
    // Implementar lógica de creación
  }
}
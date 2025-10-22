import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Angular Material
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();

  currentRoute = '';
  
  // Menu expansion states
  catalogosExpanded = false;
  clientesExpanded = false;
  ventasExpanded = false;
  eventosExpanded = false;
  usuariosExpanded = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateExpandedStates();
      });
    
    // Set initial route
    this.currentRoute = this.router.url;
    this.updateExpandedStates();
  }

  onMenuClick() {
    this.sidenavClose.emit();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
    this.sidenavClose.emit();
  }

  // Toggle menu expansion methods
  toggleCatalogos() {
    this.catalogosExpanded = !this.catalogosExpanded;
  }

  toggleClientes() {
    this.clientesExpanded = !this.clientesExpanded;
  }

  toggleVentas() {
    this.ventasExpanded = !this.ventasExpanded;
  }

  toggleEventos() {
    this.eventosExpanded = !this.eventosExpanded;
  }

  toggleUsuarios() {
    this.usuariosExpanded = !this.usuariosExpanded;
  }

  // Auto-expand based on current route
  private updateExpandedStates() {
    this.catalogosExpanded = this.currentRoute.includes('/catalogos');
    this.clientesExpanded = this.currentRoute.includes('/clientes');
    this.ventasExpanded = this.currentRoute.includes('/cotizaciones') || this.currentRoute.includes('/ventas');
    this.eventosExpanded = this.currentRoute.includes('/eventos');
    this.usuariosExpanded = this.currentRoute.includes('/usuarios') || this.currentRoute.includes('/configuracion');
  }
}
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./super-admin/super-admin.module').then( m => m.SuperAdminPageModule)
  },
  {
    path: 'counter',
    loadChildren: () => import('./counter/counter.module').then( m => m.CounterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'validation',
    loadChildren: () => import('./validation/validation.module').then( m => m.ValidationPageModule)
  },
  {
    path: 'municipality',
    loadChildren: () => import('./municipality/municipality.module').then( m => m.MunicipalityPageModule)
  },
  {
    path: 'region',
    loadChildren: () => import('./region/region.module').then( m => m.RegionPageModule)
  },
  {
    path: 'approve',
    loadChildren: () => import('./approve/approve.module').then( m => m.ApprovePageModule)
  },{
    path: 'election-results',
    loadChildren: () => import('./election-results/election-results.module').then( m => m.ElectionResultsPageModule)
  },  {
    path: 'region-stats',
    loadChildren: () => import('./region-stats/region-stats.module').then( m => m.RegionStatsPageModule)
  },

  
    

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

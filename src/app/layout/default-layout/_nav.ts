import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [

  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: ''
    }
  },

  {
    name: 'Vehicle',
    url:'/vehicle',
    iconComponent: { name: 'cil-truck' }
  },

  {
    name: 'Driver',
    url:'/driver',
    iconComponent: { name: 'cil-user' }
  },

  {
    name: 'Authorities',
    url:'/authorities',
    iconComponent: { name: 'cil-user-follow' }
  },

   {
    name: 'Profile Management',
    url:'/profile-management',
    iconComponent: { name: 'cil-user' }
  },

  // // {
  // //   name: 'Active Load',
  // //   url:'/activeload',
  // //   linkProps: { fragment: 'headings' },
  // //   iconComponent: { name: 'cil-layers' }
  // // },

  // // {
  // //   name: 'Completed Load',
  // //   url:'/completedload',
  // //   iconComponent: { name: 'cil-basket' }
  // // },

  // {
  //   name: 'Load History',
  //   url:'/loadhistory',
  //   iconComponent: { name: 'cil-description' }
  // },


  // {
  //   name: 'Bills & Invoice',
  //   url:'/billinvoice',
  //   iconComponent: { name: 'cil-file' }
  // },

  // {
  //     name: 'Documentation',
  //     url: '/Documentation',
  //     iconComponent: { name: 'cil-description' },
  //     // iconComponent: { name: 'cil-cursor' },
  //     attributes: { isDialog: true }, 
  //     children: [
  //       {
  //         name: 'LR',
  //         url: '/Documentation/LR',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link' 
  //       },
  //       {
  //         name: 'Customer Invoice',
  //         url: '/Documentation/CustomerInvoice',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link' 
  //       },
  //       {
  //         name: 'E-Way Bill Part-1',
  //         url: '/Documentation/E-WayBillPart-1',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link' 
  //       },
  //       {
  //         name: 'E-Way Bill Part-2',
  //         url: '/Documentation/E-WayBillPart-2',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link'
  //       },
  //       {
  //         name: 'Lab Reports',
  //         url: '/Documentation/LabReports',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link'
  //       },
  //       {
  //         name: 'Customer Purchase Order',
  //         url: '/Documentation/CustomerPurchaseOrder',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link'
  //       },
  //       {
  //         name: 'Other Related Documents',
  //         url: '/Documentation/OtherRelatedDocuments',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link'
  //       },
  //       {
  //         name: 'Acknowledgements',
  //         url: '/Documentation/Acknowledgements',
  //         icon: 'nav-icon-bullet',
  //         class: 'submenu-link'
  //       },
  //     ]
  //   },

  //   {
  //     name: 'Acknowledgements',
  //     url: '/Acknowledgements',
  //     iconComponent: { name: 'cil-description' },
  //     children: [
  //       {
  //         name: 'POD',
  //         url: '/Acknowledgements/POD',
  //         icon: 'nav-icon-bullet'
  //       },
  //     ]
  //   },

  //   {
  //     name: 'Freight Payments',
  //     url: '/FreightPayments',
  //     iconComponent: { name: 'cil-description' },
  //     children: [
  //       {
  //         name: 'Freight Proforma',
  //         url: '/FreightPayments/FreightProforma',
  //         icon: 'nav-icon-bullet'
  //       },
  //       {
  //         name: 'Transporter Invoice',
  //         url: '/FreightPayments/TransporterInvoice',
  //         icon: 'nav-icon-bullet'
  //       },
  //       {
  //         name: 'Acknowledgements',
  //         url: '/FreightPayments/Acknowledgements',
  //         icon: 'nav-icon-bullet'
  //       },
  //       {
  //         name: 'Advance Payment Receipt',
  //         url: '/FreightPayments/AdvancePaymentReceipt',
  //         icon: 'nav-icon-bullet'
  //       },
  //       {
  //         name: 'Final Payment Advice',
  //         url: '/FreightPayments/FinalPaymentAdvice',
  //         icon: 'nav-icon-bullet'
  //       },
  //     ]
  //   },

  

];

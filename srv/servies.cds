using {example18.db as database} from '../db/schema';
using {example18.common as common} from '../db/common';


service CatalogServices {
  //Master data which is in master Context
 
  entity EmployeeSrv        as projection on database.master.Employees
  actions{
    action increaseprice() returns EmployeeSrv;
  
  };
  


  entity ProductSrv         as projection on database.master.Products;

  entity BusinessPartnerSrv as projection on database.master.BusinessPartners;

  entity AddressSrv         as projection on database.master.Addresses;

  //Transactional data which is in Transaction context

  entity PurchaseOrderSrv   as projection on database.transaction.PurchaseOrders;

  entity PurchaseItemsSrv   as projection on database.transaction.PurchaseItems;

  action createEmployee(

  Currency_code: String(3),
                        ID: UUID,
                        accountNumber: common.String32,
                        bankId: String(16),
                        bankName: common.String64,
                        email: common.Email,
                        gender: common.Gender,
                        language: String(2),
                        loginName: String(16),
                        nameFirst: common.String64,
                        nameInitials: common.String64,
                        nameLast: common.String64,
                        nameMiddle: common.String64,
                        phoneNumber: common.PhoneNumber,
                        salaryAmount: common.AmountT,

  ) returns array of EmployeeSrv;

  action createaddress(ADDRESS_TYPE: common.String32,
                       BUILDING: common.String255,
                       CITY: common.String255,
                       COUNTRY: common.String255,
                       LATITUDE: Decimal,
                       LONGITUDE: Decimal,
                       NODE_KEY: common.Guid,
                       POSTAL_CODE: String(12),
                       STREET: common.String255,
                       VAL_END: Date,
                       VAL_START: Date,

  ) returns array of AddressSrv;

  action updateemployee(
    ID: UUID,
    salaryAmount: common.AmountT,
    Currency_code: String(3),

    
  )returns String;

  action updatecity(
    NODE_KEY: common.Guid,
    
    CITY: common.String255,

  )returns String;
  action updateprice (
    NODE_KEY       : common.Guid,
    PRICE          : Decimal(15, 2)

  )returns String;
  action createproduct(
    NODE_KEY       : common.Guid,
            PRODUCT_ID     : common.String32,
            TYPE_CODE      : String(2),
              CATEGORY       : common.String32,
              DESCRIPTION    : common.String255,
            TAX_TARIF_CODE : Integer,
            MEASURE_UNIT   : String(2),
            WEIGHT_MEASURE : Decimal(5, 2),
            WEIGHT_UNIT    : String(2),
            PRICE          : Decimal(15, 2),
            CURRENCY_CODE  : String(5),
            WIDTH          : Decimal(5, 2),
            DEPTH          : Decimal(5, 2),
            HEIGHT         : Decimal(5, 2),
            DIM_UNIT       : String(2),
  )returns array of ProductSrv;

  action deleteemp(
    ID : UUID
  )returns String;
  function gethighsalary()returns array of EmployeeSrv;
  function Gethighpricepro()returns array of ProductSrv;
  
}

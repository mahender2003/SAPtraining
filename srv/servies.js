module.exports = cds.service.impl(async function () {



    // Step-1 : Define service entities
    const { EmployeeSrv, AddressSrv, ProductSrv ,PurchaseItemsSrv} = this.entities;

    this.on('createaddress', async (request, response) => {

        const address = request.data;
        const transact = cds.tx(request);

        let data = await transact.run(
            INSERT.into(AddrssSrv).entries(address)
        ).then((resolve, reject) => {
            if (typeof (resolve) !== undefined) {
                return address;

            }
            else {
                request.error(500, 'error in inserting data');

            }

        }).catch(err => request.error(err.toString()));

        return data;




    })


    // Implementation of an action
    // There are 3 generic handlers
    // .before() : Pre-check and validation
    // .on() : Performing DB operations
    // .after() : To save / close connections

    this.on('createEmployee', async (request, response) => {

        // Step-2 : Get the data which is coming from the API
        const empData = request.data;

        // Step-3 : Instantiate the transaction object
        const objTransaction = cds.tx(request);

        // Step-4 : Insert the record into database
        let returnData = await objTransaction.run(
            INSERT.into(EmployeeSrv).entries(empData)
        ).then((resolve, reject) => {

            if (typeof (resolve) !== undefined) {
                return request.data;
            } else {
                request.error(
                    500,
                    "Error in inserting data into the database"
                );
            }

        }).catch(err => {
            request.error(
                "There is an error : ",
                err.toString()
            );
        });

        // Step-5 : Return the data
        return returnData;

    });

    this.on('updateemployee', async (request, response) => {
        const {
            ID,
            salaryAmount,
            Currency_code
        } = request.data;

        try {
            const connect = cds.tx(request);
            await connect.update(EmployeeSrv).with({
                salaryAmount: salaryAmount,
                Currency_code: Currency_code,
            }).where(
                {
                    ID: ID
                }
            )
            return "update done";
        } catch (error) {
            request.error("error", error);

        }

    })

    this.on('updatecity', async (request, response) => {
        const {
            NODE_KEY,

            CITY
        } = request.data;
        try {
            const connection = cds.tx(request);
            await connection.update(AddressSrv).with({


                CITY: CITY
            }).where({

                NODE_KEY: NODE_KEY,
            })
            return "updated city";
        } catch (error) {
            request.error("eroor", error);
        }

    })

    this.on('updateprice', async (request, response) => {
        const {
            NODE_KEY,
            PRICE
        } = request.data;
        try {
            const conn = cds.tx(request);
            await conn.update(ProductSrv).with({
                PRICE: PRICE
            }).where({
                NODE_KEY: NODE_KEY
            })
            return "price updated";
        } catch (error) {
            request.error("error", error);
        }



    })

    this.on('createproduct', async (request, response) => {
        const data = request.data;
        try {
            const connection = cds.tx(request);
            await connection.inser(data).into(ProductSrv);
            return data;

        } catch (error) {
            request.error("error:", error);
        }
    })

    this.on('deleteemp', async (request) => {

    const { ID } = request.data;

    try {

        const deletedRows = await DELETE
            .from(EmployeeSrv)
            .where({ ID });

        if (deletedRows === 0) {
            request.error(404, "Employee not found");
        }

        return `Employee with ${ID} deleted`;

    } catch (error) {

        request.error(500, error.toString());

    }

});
 this.before('UPDATE',async(request,response) => {
    const salary = request.data.salaryAmount;
    if(salary > 100000){
        request.error(500,'get approval from manager');
    }
 });
 this.before('UPDATE',ProductSrv,async(request)=>{
    const price =request.data.PRICE;
    if(price < 100){
        request.error(500,"the price is too low");
    }
 });
 this.before('UPDATE',PurchaseItemsSrv,async(req)=>{
    const gross =req.data;
    if(gross.CURRENCY_code == "USD"){
        if(gross.GROSS_AMOUNT > 15000){
            req.error(500,"get in touch with line manager")
        }
    }
    if(gross.CURRENCY_code == "EUR"){
        if(gross.GROSS_AMOUNT > 10000){
            req.error(500,"get in touch with reginal head")
        }
    }
    
 });
 this.before('UPDATE',AddressSrv,async(req)=>{
    const address =req.data;
    const adin = await SELECT.one.from(AddressSrv).where({NODE_KEY: address.NODE_KEY})
    if(adin == "GB" || adin=="US"){
       
            req.error(500,"it is already "+adin);
        
    }
    else{
        if(address.COUNTRY!="GB" && address.COUNTRY!="US"){
                req.error(500,"it cannot be "+address.COUNTRY);
        
        }
    }
    
});
this.on('gethighsalary',async(req)=>{
    const tx =cds.tx(req);
    const res = await tx.read(EmployeeSrv).orderby({salaryAmount : 'desc'}).limit(10);
    return res;
});

this.on('Gethighpricepro',async(req)=>{

    const tx =cds.tx(req);
    try{
    const res = await tx.read(ProductSrv).orderby({PRICE : 'asce'}).limit(1);
    return res;
    }
    catch(error){
            req.error("error",error);
    }
});
this.on('increaseprice',async(req)=>{
    const ID = req.params[0];
    const tx =cds.tx(req);
    try{
    await tx.update(EmployeeSrv).with({salaryAmount : {'*=' :1.15}}).where(ID);
    return await tx.run(
            SELECT.one.from(EmployeeSrv).where(ID)
        );
    }
    catch(error){
            req.error("error",error);
    }
});





});
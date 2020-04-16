/*
    BY USING THIS FUNCTION WE WILL GET RID OF TRY CATCH BLOCK IN THE HANDLERS OF THE ROUTES
    JUST BY USING PROMISE
*/

//receives a function and returns a function with three input params


/*THIS FUNCTION TAKES (ASYNC FUNCTION )>> WE WANNA DELETE (TRY CATCH) SO WE WILL EXECUTE THEM I THIS FUNCTION 
 TO APPLY DRY PRINCIPLE (DON'T REPEAT YOURSELF*/
//WE DON'T USE THWE WORD FUNCTION BECAUSE WE DEFINE "ARROW FUNCTION"
/*
THIS FUNC TAKE FUNCTION (FN) AND RETURNS A FUNCTION WITH 3 PARAMS
FN >> ASYNC FUNCTION (PARAMETER) => EXECUTE A FUNCTION THAT WILL TAKE 3 PARAMS (REQ, RES, NEXT) >> WILL BE EXTRACTED FROM 
    FN PASSED TO THE FUNCTION 
    THEN MAKING A PROMISE:
        1- PROMISE.RESOLVE >> RETURN THE RESULT OF EXECUTING FN(REQ, RES, NEXT)
        2- IF THE FUNCTION DOESN'T EXECUTE DUE TO ERROR OCCURED THEN CATCH WILL EXECUTE NEXT
*/
const asyncHandler = fn => (req, res, next) =>
    Promise
        .resolve(fn(req, res, next))            //execute the function passed to asyncHandler >> pass its params to it 
        .catch(next)                            //sync function >> next 

/*
    here the error will be passed to the custom error handler 
*/


module.exports = asyncHandler;
//The Promise is an object that represents either completion or failure of a user task
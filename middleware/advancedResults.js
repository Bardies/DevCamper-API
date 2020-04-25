// we will use middleware to use it with all resources
// middleware >> (req, res, next)
// we need to pass 2 params (model, populate)

const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    //we take a copy to remove select from it and in the same time we want to check if the fields are exist in rq.query or not
    let reqQuery = { ...req.query }


    //delete fields
    let removeFields = ['select', 'sort', 'page', 'limit']
    removeFields.forEach(param => delete reqQuery[param])
    let queryStr = JSON.stringify(reqQuery);
    //limit, page
    let limit = parseInt(req.query.limit) || 25;
    let page = parseInt(req.query.page) || 1;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let total = await model.countDocuments();


    //replace(str|regex, replacement|function) >> function (match, offset, ...) called for each match and return value will be the replacement
    //REGEX:  g > global (the entire string not the first word we met only)
    queryStr = queryStr.replace(/\b(in|gt|gte|lt|lte)\b/g, match => `$${match}`);
    query = model.find(JSON.parse(queryStr))                //find (obj) 


    //ADD QUERY HERE CUZ IT DEPENDS ON (PAGE AND LIMIT) AND THEY HAVE DEFAULT VALUES.. NO NEED FOR CONDITIONS/ ANYTHING ELSE
    query = query.skip(startIndex).limit(limit)



    //chech the fields and do an action on the query that use it to fetch from the DB
    // console.log(`select: ${req.query.select}`)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(" ")     // >> ['name', 'description'] >> name description
        query = query.select(fields)                             // query.select('field1 field2 field3')
    }

    //sort (split >> returns an "array", join >> returns a "string")
    // console.log(`sort: ${req.query.sort}`);
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(" ")
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }
    //add pagination (add an obj(pagenation) to the response >> we can use it easily in fronyend)
    pagenation = {}
    if (startIndex > 0) {
        pagenation.previous = {          //add property
            previous_page: page - 1,
            limit                        //key and value are the same name
        }
    }
    if (endIndex < total) {
        pagenation.next = {
            next_page: page + 1,
            limit
        }
    }

    if (populate) {
        query = query.populate(populate)
    }

    const results = await query

    res.advancedResults = {
        success: true,
        count: results.length,
        pagenation,
        data: results

    }

    next();
}

module.exports = advancedResults;


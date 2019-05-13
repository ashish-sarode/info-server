import Middleware from '../../middleware/middleware'

const mongooseErrorHandler = require('mongoose-error-handler');
const middleware = new Middleware();

/**
 * Abstract class for basic CRUD operations.
 * 
 * @abstract
 * @class BaseController
 */
abstract class BaseController {

  abstract model: any;
  public size = 10;
  public searchFilter = {};


  /**
   * Function to get all records from the collection.
   *
   * @memberof BaseController
   */
  getAll = async (req, res, next) => {
    try {
      const pageNo = ((!isNaN(req.body.page) && (parseInt(req.body.page) > 0)) ? parseInt(req.body.page) : 1);
      this.size = parseInt(req.body.limit) || this.size;
      const filters = { skip: this.size * (pageNo - 1), limit: this.size };
      const { error, recordsFound } = await this.model.countDocuments(req.body.searchFilter || {});

      if (error) { return next(error); }
      const totalRecords = recordsFound;

      this.model.find(req.body.searchFilter || {}, {}, filters, (err, records) => {
        if (err) { return next(err); }
        //console.log(req.decoded.user);
        if (records.length == 0) {
          return res.status(200).json(this.filterResponse(true, 200, 'No records found.', { records: records, pagination: {} }));
        }
        return res.status(200).json(this.filterResponse(true, 200, 'Records fetched successfully.', { records: records, pagination: { currentPage: pageNo, totalPages: Math.ceil(totalRecords / this.size), recordsFound: totalRecords } }));
      });
    } catch (ex) {
      return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
    }

  }

  /**
   * Function to get count of all records from the collection.
   *
   * @memberof BaseController
   */
  count = (req, res, next) => {
    try {
      this.model.count((err, count) => {
        if (err) { return next(err); }
        return res.status(200).json(this.filterResponse(true, 200, 'Records fetched successfully.', { records: count }));
      });
    } catch (ex) {
      return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
    }
  }

  /**
   *Function to save the record in the collection.
   *
   * @memberof BaseController
   */
  insert = (req, res, next) => {
    const obj = new this.model(req.body);
    try {
      obj.save((err, item) => {
        let data;
        // 11000 is the code for duplicate key error
        if (err && err.code === 11000) {
          console.log(err);
          data = { errors: { unique: 'Record is already exists' } };
          return res.status(200).json(this.filterResponse(false, 200, 'Record is already exists.', data));
        }
        if (err) {
          console.log(err);
          data = (err.name == 'ValidationError') ? mongooseErrorHandler.set(err) : err;
          return res.status(200).json(this.filterResponse(false, 200, 'Parameters missing.', data));
        }
        return res.status(200).json(this.filterResponse(true, 200, 'Record inserted successfully!.', item));
      });
    } catch (ex) {
      return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
    }
  }

  /**
   *Function to get the single record from the collection by record id
   *
   * @memberof BaseController
   */
  get = (req, res, next) => {
    try {
      this.model.findOne({ _id: req.params.id }, (err, item) => {
        if (err) { return next(err); }
        return res.status(200).json(this.filterResponse(true, 200, 'Record found successfully!.', item));
      });
    } catch (ex) {
      return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
    }
  }

  /**
   *Function to update collection record.
   *
   * @memberof BaseController
   */
  update = (req, res, next) => {
    try {
      this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) { return next(err); }
        return res.status(200).json(this.filterResponse(true, 200, 'Record updated successfully!.', req.body));
      });
    } catch (ex) {
      return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
    }
  }

  /**
   *Function to delete collection record.
   *
   * @memberof BaseController
   */
  delete = (req, res, next) => {
    try {
      this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return next(err); }
        return res.status(200).json(this.filterResponse(true, 200, 'Record deleted successfully!.', { _id: req.params.id }));
      });
    } catch (ex) {
      return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
    }
  }

  /**
   *Function to filter the response.
   *
   * @memberof BaseController
   */
  filterResponse = (status: Boolean, statusCode: Number, message: String, data: any) => {

    return { status: { isSuccessful: status, code: statusCode, message: message }, data: data };
  }
}

export default BaseController;

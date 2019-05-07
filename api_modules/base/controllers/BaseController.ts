
const mongooseErrorHandler = require('mongoose-error-handler');
abstract class BaseController {

  abstract model: any;
  public size = 10;

  /**
   * Function to get all records from the collection.
   *
   * @memberof BaseController
   */
  getAll = (req, res) => {
    try {
      var filters = { skip: 0, limit: this.size };
      var pageNo = ((parseInt(req.query.page) || 1) < 0) ? 1 : parseInt(req.query.page);
      this.size = parseInt(req.query.limit) || this.size;
      filters.skip = this.size * (pageNo - 1);
      filters.limit = this.size;

      this.model.find({}, {}, filters, (err, records) => {
        if (err) { return console.error(err); }
        //console.log(req.decoded.user);
        return res.status(200).json(this.filterResponse(true, 200, 'Records fetched successfully.', records));
      });
    } catch (ex) {
      return res.status(500).json(this.filterResponse(false, 500, 'Something went wrong.', ex));
    }

  }

  /**
   * Function to get count of all records from the collection.
   *
   * @memberof BaseController
   */
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }

  /**
   *Function to save the record in the collection.
   *
   * @memberof BaseController
   */
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      let data;
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        console.log(err);
        data = { errors: { unique: 'Record is already exists' } };
        return res.status(400).json(this.filterResponse(false, 400, 'Record is already exists.', data));
      }
      if (err) {
        console.log(err);
        data = (err.name == 'ValidationError') ? mongooseErrorHandler.set(err) : err;
        return res.status(400).json(this.filterResponse(false, 400, 'Something went wrong.', data));
      }
      return res.status(200).json(this.filterResponse(true, 200, 'Record inserted successfully!.', item));
    });
  }

  /**
   *Function to get the single record from the collection by record id
   *
   * @memberof BaseController
   */
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  /**
   *Function to update collection record.
   *
   * @memberof BaseController
   */
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  /**
   *Function to delete collection record.
   *
   * @memberof BaseController
   */
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
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
//https://www.joyent.com/node-js/production/design/errors
//https://expressjs.com/en/guide/error-handling.html

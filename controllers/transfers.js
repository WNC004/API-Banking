// Models
const Transfer = require('@models/transfer');

// Utilities
const { throwError, passError, handleValidationErrors } = require('@util/errors');
const { checkUpdatesValid, applyUpdates } = require('@util/updates');
const sendEmail = require('@util/notifications/send-email')

// App

// Get all my transfers
exports.getMyTransfers = async (req, res, next) => {
   try {
      let transfers = await Transfer.find({
         $or: [{ sender: req.user._id }, { recipient: req.user._id }]
      }).lean();

      if (!transfers) {
         throwError('No transfers found', 422);
      }

      res.status(200).json(transfers);
   } catch (err) {
      passError(err, next);
   }
};

// Get single transfer
exports.getSingle = async (req, res, next) => {
   try {
      let transfer = await Transfer.findOne({
         _id: req.params.id,
         $or: [{ sender: req.user._id }, { recipient: req.user._id }]
      }).lean();

      if (!transfer) {
         throwError('No transfer found', 422);
      }

      res.status(200).json(transfer);
   } catch (err) {
      passError(err, next);
   }
};

// Create a new transfer
exports.create = async (req, res, next) => {
   const transfer = new Transfer(req.body);

   try {
      await transfer.save();

      if (!transfer) {
         throwError('Problems sending a transfer', 422);
      }
      // Step 2
      let mailOptions = {
         from: 'ductrapt@gmail.com', // TODO: email sender
         to: req.user.email,
         subject: 'Transfer successfully!',
         text: 'Wooohooo it works!!'
      };
      sendEmail.sendEmail(mailOptions);

      res.status(201).json({ message: 'Transfer sent' });
   } catch (err) {
      passError(err, next);
   }
};

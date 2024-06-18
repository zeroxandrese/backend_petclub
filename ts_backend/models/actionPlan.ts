const { Schema, model } = require('mongoose');

const ActionPlanSchema = Schema({
    actionPlan:{
        type: String,
        required:[true, 'El actionplan es obligatorio']
    }
});

module.exports = model('ActionPlan',ActionPlanSchema);
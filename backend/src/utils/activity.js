const ActivityLog = require("../models/ActivityLog");

async function logActivity({ actor, action, entityType, entityId, metadata = {} }) {
  await ActivityLog.create({
    actor,
    action,
    entityType,
    entityId,
    metadata,
  });
}

module.exports = logActivity;

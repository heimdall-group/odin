import mongoose from 'mongoose';
import Events from '~/server/models/events';
import EventsApplications from '~/server/models/event-application';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { id, group_id, role_id } = await readBody(event);

    const { data, success, error } = await getPermissionsObject(token);
    if (!success || !data) {
      throw 'Failed to get permissions';
    }
    const { permissions, user, super_admin, external } = data;
    if ((permissions['event'] === undefined || !permissions['event'].read) && !super_admin && !external) {
      throw 'Permission denied';
    }

    let added = false;
    let application = false;
    let removed = false;

    const document = await Events.findOne({_id: id});
    if (!document) {
      throw 'Cannot find document'
    }

    const group = document.assignees.filter((group) => group.id == group_id)[0];
    if (group === undefined) {
      throw 'Cannot find group';
    }

    const role = group.roles.filter((role) => role.id == role_id)[0]
    if (role === undefined) {
      throw 'Cannot find role';
    }

    if (
      role.application && !super_admin &&
      (
        permissions['event-application'] === undefined || !permissions['event-application'].write ||
        permissions['event-combat-application'] === undefined || !permissions['event-combat-application'].write
      )
    ) {
      // ADD NOTIFICATION HERE
      const applicationInstance = new EventsApplications({
        applicant: user,
        role: role_id,
        group: group_id,
        event: id,
        type: document.type,
        date: new Date(),
      });
      applicationInstance.save()
      application = true
    } else {
      const removeUpdate = await Events.updateMany(
        { _id: id },
        {
          $set: {
            'assignees.$[].roles.$[b].uid': "",
          },
        },
        {
          arrayFilters: [
            { 'b.uid': user },
          ],
        },
      );
  
      const addUpdate = await Events.updateOne(
        { _id: id },
        {
          $set: {
            'assignees.$[a].roles.$[b].uid': user,
          },
        },
        {
          arrayFilters: [
            { 'a.id': new mongoose.Types.ObjectId(group_id) },
            { 'b.id': new mongoose.Types.ObjectId(role_id) },
          ],
        },
      );

      removed = removeUpdate.acknowledged
      added = addUpdate.acknowledged
    }

    return removeRequestKeys({
      data: {
        remove: removed,
        application: application,
        add: added,
      },
      type: 'Standard',
      success: true,
    }, event);
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});

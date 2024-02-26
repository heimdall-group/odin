// export const getEventsPipeline = ($match: Object, user: string, skip: number = 0, limit: number = 999999999): Array<any> => {
//   return [
//     {
//       $match: $match,
//     },
//     {
//       $sort: { 'date': -1 },
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'author',
//         foreignField: 'uid',
//         as: 'authorDetails'
//       }
//     },
//     {
//       $addFields: {
//         assignees: {
//           $ifNull: [ "$assignees", [ null ] ]
//         }
//       }
//     },
//     {
//       $unwind: {
//         path: "$assignees",
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $unwind: {
//         path: "$assignees.roles",
//         preserveNullAndEmptyArrays: true
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "assignees.roles.uid",
//         foreignField: "uid",
//         as: "userDetails"
//       }
//     },
//     {
//       $unwind: {
//         path: "$userDetails",
//         preserveNullAndEmptyArrays: true
//       }
//     },
//     {
//       $set: {
//         "assignees.roles.user": {
//           $cond: {
//             if: {
//               $and: [
//                 { $ne: ["$assignees", []] },
//                 { $ne: ["$userDetails", null] },
//                 { $ne: ["$userDetails.nickname", null] },
//                 { $ne: [{ $ifNull: ["$assignees.roles", null] }, null] },
//                 { $ne: ["$assignees.roles.uid", '']}
//               ]
//             },
//             then: {
//               nickname: "$userDetails.nickname",
//               currentUser: { $eq: ["$assignees.roles.uid", user]}
//             },
//             else: false,
//           }
//         }
//       }
//     },
//     { 
//       $unset: "assignees.roles.uid",
//     },
//     {
//       $group: {
//         _id: {
//           eventId: "$_id",
//           assigneeId: "$assignees.id"
//         },
//         roles: { $push: "$assignees.roles" },
//         assigneeDetails: { $first: "$assignees" },
//         authorDetails: { $first: "$authorDetails" },
//         date: { $first: "$date" },
//         desc: { $first: "$desc" },
//         max_assignes: { $first: "$max_assignes" },
//         public: { $first: "$public" },
//         title: { $first: "$title" },
//         type: { $first: "$type" },
//         active: { $first: "$active" },
//         external: { $first: "$external" },
//         interested: { $first: "$interested" },
//         recurring: { $first: "$recurring" },
//       }
//     },
//     {
//       $unwind: "$assigneeDetails"
//     },
//     {
//       $unwind: "$authorDetails"
//     },
//     {
//       $lookup: {
//         from: 'roles',
//         localField: 'authorDetails.roles',
//         foreignField: 'id',
//         as: 'authorRoles'
//       }
//     },
//     {
//       $project: {
//         id: "$_id.eventId",
//         assignees: {
//           id: "$_id.assigneeId",
//           name: "$assigneeDetails.name",
//           type: "$assigneeDetails.type",
//           roles: "$roles",
//           order: "$assigneeDetails.order",
//         },
//         author: {
//           nickname: "$authorDetails.nickname",
//           roles: "$authorRoles.name"
//         },
//         date: 1,
//         desc: 1,
//         max_assignes: 1,
//         public: 1,
//         title: 1,
//         type: 1,
//         active: 1,
//         external: 1,
//         interested: 1,
//         recurring: 1,
//       }
//     },
//     {
//       $group: {
//         _id: "$id",
//         assignees: { $push: "$assignees" },
//         date: { $first: "$date" },
//         desc: { $first: "$desc" },
//         max_assignes: { $first: "$max_assignes" },
//         public: { $first: "$public" },
//         title: { $first: "$title" },
//         type: { $first: "$type" },
//         author: { $first: "$author" },
//         active: { $first: "$active" },
//         external: { $first: "$external" },
//         interested: { $first: "$interested" },
//         recurring: { $first: "$recurring" },
//       }
//     },
//     {
//       $project: {
//         id: "$_id",
//         assignees: 1,
//         date: 1,
//         desc: 1,
//         max_assignes: 1,
//         public: 1,
//         title: 1,
//         type: 1,
//         author: 1,
//         active: 1,
//         external: 1,
//         currentUserIsInterested: {
//           $in: [user, "$interested"]
//         },
//         recurring: 1,
//       }
//     }
//   ];
// };

export const getEventsPipeline = ($match: Object, user: string, skip: number = 0, limit: number = 999999999): Array<any> => {
  return [
    {
      $match: $match,
    },
    {
      $sort: { 'date': -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: 'uid',
        as: 'authorDetails'
      }
    },
    {
      $addFields: {
        assignees: {
          $ifNull: ["$assignees", [null]]
        }
      },
    },
    {
      $unwind: {
        path: "$assignees",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: "$assignees.roles",
        preserveNullAndEmptyArrays: true
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignees.roles.uid",
        foreignField: "uid",
        as: "userDetails"
      }
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $set: {
        "assignees.roles.user": {
          $cond: {
            if: {
              $and: [
                { $ne: ["$assignees", []] },
                { $ne: ["$userDetails", null] },
                { $ne: ["$userDetails.nickname", null] },
                { $ne: ["$assignees.roles.uid", ''] }
              ]
            },
            then: {
              nickname: "$userDetails.nickname",
              currentUser: { $eq: ["$assignees.roles.uid", user] }
            },
            else: false,
          }
        }
      }
    },
    {
      $unset: "assignees.roles.uid",
    },
    {
      $group: {
        _id: {
          eventId: "$_id",
          assigneeId: "$assignees.id"
        },
        roles: { $push: "$assignees.roles" },
        assigneeDetails: { $first: "$assignees" },
        authorDetails: { $first: "$authorDetails" },
        date: { $first: "$date" },
        desc: { $first: "$desc" },
        max_assignes: { $first: "$max_assignes" },
        public: { $first: "$public" },
        title: { $first: "$title" },
        type: { $first: "$type" },
        status: { $first: "$status" },
        external: { $first: "$external" },
        interested: { $first: "$interested" },
        recurring: { $first: "$recurring" },
      }
    },
    {
      $unwind: "$assigneeDetails"
    },
    {
      $unwind: "$authorDetails"
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'authorDetails.roles',
        foreignField: 'id',
        as: 'authorRoles'
      }
    },
    {
      $project: {
        id: "$_id.eventId",
        assignees: {
          id: "$_id.assigneeId",
          name: "$assigneeDetails.name",
          type: "$assigneeDetails.type",
          roles: "$roles",
          order: "$assigneeDetails.order",
        },
        author: {
          nickname: "$authorDetails.nickname",
          roles: "$authorRoles.name"
        },
        date: 1,
        desc: 1,
        max_assignes: 1,
        public: 1,
        title: 1,
        type: 1,
        status: 1,
        external: 1,
        interested: 1,
        recurring: 1,
        currentUserIsInterested: {
          $in: [user, "$interested"]
        },
      }
    },
    {
      $group: {
        _id: "$id",
        assignees: { $push: "$assignees" },
        date: { $first: "$date" },
        desc: { $first: "$desc" },
        max_assignes: { $first: "$max_assignes" },
        public: { $first: "$public" },
        title: { $first: "$title" },
        type: { $first: "$type" },
        author: { $first: "$author" },
        status: { $first: "$status" },
        external: { $first: "$external" },
        interested: { $first: "$interested" },
        recurring: { $first: "$recurring" },
        currentUserIsInterested: { $first: "$currentUserIsInterested" },
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'interested',
        foreignField: 'uid',
        as: 'interestedDetails'
      }
    },
    {
      $project: {
        id: "$_id",
        assignees: 1,
        date: 1,
        desc: 1,
        max_assignes: 1,
        public: 1,
        title: 1,
        type: 1,
        author: 1,
        status: 1,
        external: 1,
        interested: '$interestedDetails.nickname',
        recurring: 1,
        currentUserIsInterested: 1,
      }
    }
  ];
};



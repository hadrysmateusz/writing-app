export const schema = {
  models: {
    Document: {
      name: "Document",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        title: {
          name: "title",
          isArray: false,
          type: "String",
          isRequired: true,
          attributes: [],
        },
        content: {
          name: "content",
          isArray: false,
          type: "String",
          isRequired: true,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: "Documents",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "auth",
          properties: {
            rules: [
              {
                provider: "userPools",
                ownerField: "owner",
                allow: "owner",
                identityClaim: "cognito:username",
                operations: ["create", "update", "delete"],
              },
            ],
          },
        },
      ],
    },
  },
  enums: {},
  nonModels: {},
  version: "069f63b9de9838300f2597db9befedd1",
}

// Helper function for pagination
export const paginate = async (
  model,
  query = {},
  page = 1,
  perPage = 10,
  sort = { createdAt: -1 },
  populateOptions = [],
  select = []
) => {
  const skip = (page - 1) * perPage;

  let queryBuilder = model
    .find(query)
    .skip(skip)
    .limit(perPage)
    .sort(sort)
    .select(select);

  populateOptions.forEach((option) => {
    queryBuilder = queryBuilder.populate(option);
  });

  const documents = await queryBuilder;

  const totalCount = await model.countDocuments(query);
  const totalPages = Math.ceil(totalCount / perPage);

  return {
    documents,
    pagination: {
      totalCount,
      totalPages,
      currentPage: page,
      perPage,
    },
  };
};

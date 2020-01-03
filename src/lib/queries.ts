import { QueryKey, QueryInfo } from "./baseTypes";

const data: any = {
  allPeople: {
    indices: "people",
    body: {
      query: {
        match_all: {},
      },
    },
  },
  peopleNamedDawna: {
    indices: "people",
    body: {
      query: {
        match: {
          first_name: { query: "dawna" },
        },
      },
    },
  },
  peopleWithAtLeastTwoAddresses: {
    indices: "people",
    body: {
      query: {
        range: {
          address_count: { gte: 2 },
        },
      },
    },
  },
  addressesInIllinois: {
    indices: "addresses",
    body: {
      query: {
        term: {
          state_code: { value: "IL" },
        },
      },
    },
  },
  firstNameDOrLastNameB: {
    indices: "people",
    body: {
      query: {
        bool: {
          should: [
            { prefix: { first_name: { value: "d" } } },
            { prefix: { last_name: { value: "b" } } },
          ],
          minimum_should_match: 1,
        },
      },
    },
  },
};

const queries = function(key: QueryKey): QueryInfo | null {
  if (data.hasOwnProperty(key)) {
    const result = data[key];
    result.key = key;
    return result;
  } else {
    return null;
  }
}

const keys = function(): QueryKey[] {
  return Object.keys(data);
}

export { queries, keys };

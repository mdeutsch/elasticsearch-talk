import { OutputList, QueryInfo } from "./baseTypes";
import { seeds, Person, Address } from "./seeds";

class EsClient {
  private indices = ['people', 'addresses'];

  private personMapping = {
    properties: {
      first_name: { type: "text" },
      last_name: { type: "text" },
      full_name: { type: "text" },
      address_count: { type: "integer" },
    },
  };

  private addressMapping = {
    properties: {
      person_id: { type: "integer" },
      street: { type: "text" },
      city: { type: "text" },
      state_code: { type: "keyword" },
      zip_code: { type: "keyword" },
      full_address: { type: "text" },
    },
  };

  url(path: string) {
    return `http://localhost:9200/${path}`;
  }

  async setup() {
    const output: OutputList = [];
    output.push(...await this.createIndices());
    output.push(...await this.createMappings());
    output.push(...await this.indexSeeds());
    return output;
  }

  async teardown() {
    const output: OutputList = [];
    output.push(...await this.dropIndices());
    return output;
  }

  async createIndices() {
    const output: OutputList = [];
    let response: Response;

    for(const indexName of this.indices) {
      const url = this.url(indexName);

      output.push(`request:  HEAD ${url}`);
      response = await fetch(url, { method: 'HEAD' });
      output.push(`response: ${response.status}`, await response.text());

      if (response.status === 404) {
        output.push(`request:  PUT ${url}`);
        response = await fetch(url, { method: 'PUT' });
        output.push(`response: ${response.status}`, await response.json());
      }
    }

    return output;
  }

  async createMappings() {
    const output: OutputList = [];

    output.push(...await this.request('PUT', 'people/_mappings', this.personMapping, 'json'));
    output.push(...await this.request('PUT', 'addresses/_mappings', this.addressMapping, 'json'));

    return output;
  }

  async dropIndices() {
    const output: OutputList = [];
    let response: Response;

    for(const indexName of this.indices) {
      const url = this.url(indexName);

      output.push(`request: HEAD ${url}`);
      response = await fetch(url, { method: 'HEAD' });
      output.push(`response: ${response.status}`, await response.text());
      output.push("");

      if (response.status === 200) {
        output.push(`request: DELETE ${url}`);
        response = await fetch(url, { method: 'DELETE' });
        output.push(`response: ${response.status}`, await response.json());
        output.push("");
      }
    }

    return output;
  }

  async indexSeeds() {
    const output: OutputList = [];

    for(const person of seeds) {
      output.push(...await this.request('PUT', `people/_doc/${person.id}`, this.personDocument(person), 'json'));

      for(const address of person.addresses) {
        output.push(...await this.request('PUT', `addresses/_doc/${address.id}`, this.addressDocument(person, address), 'json'));
      }
    }

    return output;
  }

  async search(queryInfo: QueryInfo) {
    return this.request('POST', `${queryInfo.indices}/_search`, queryInfo.body, 'json');
  }

  async explain(queryInfo: QueryInfo) {
    return this.request('POST', `${queryInfo.indices}/_explain/1`, queryInfo.body, 'json');
  }

  private async request(method: string, path: string, body: object | null, responseMethod: string) {
    const output: OutputList = [];
    const url = this.url(path);

    output.push(`request: ${method} ${url}`);

    const fetchOptions: any = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body);
      output.push(body);
    }

    const response = await fetch(url, fetchOptions);
    const responseContent = await (response as any)[responseMethod]();

    output.push(`response: ${response.status}`, responseContent);
    output.push("");

    return output;
  }

  private personDocument(person: Person) {
    return {
      first_name: person.firstName,
      last_name: person.lastName,
      full_name: person.fullName(),
      address_count: person.addressCount(),
    };
  }

  private addressDocument(person: Person, address: Address) {
    return {
      person_id: person.id,
      street: address.street,
      city: address.city,
      state_code: address.stateCode,
      zip_code: address.zipCode,
      full_address: address.fullAddress(),
    };
  }
}

export default EsClient;

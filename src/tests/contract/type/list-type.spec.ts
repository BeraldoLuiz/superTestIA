import { assertContract } from '@api/assert-contract';
import { listTypes } from '@api/routes/type';
import { typeListSchema } from '@api/schemas/type.schema';

describe('[CONTRACT][TYPE] GET /type', () => {
  it('matches the paginated list contract', async () => {
    const res = await listTypes({ limit: 5 });

    const body = assertContract(typeListSchema, res);

    expect(body.results).toHaveLength(5);
  });
});

import { assertContract } from '@api/assert-contract';
import { getTypeByName } from '@api/routes/type';
import { typeDetailSchema } from '@api/schemas/type.schema';
import { fetchType } from '@support/fixtures/type';

describe('[FUNCTIONAL][TYPE] GET /type/{name|id}', () => {
  it('returns flying with its canonical id', async () => {
    const res = await getTypeByName('flying');

    // 2xx GET: assertContract checks the status AND validates the schema.
    const flying = assertContract(typeDetailSchema, res);
    expect(flying.id).toBe(3);
    expect(flying.name).toBe('flying');
  });

  it('resolves the same type by name and by id', async () => {
    const byName = await fetchType('flying'); // precondition: get the id
    const res = await getTypeByName(byName.id);

    const flying = assertContract(typeDetailSchema, res);
    expect(flying.name).toBe('flying');
  });

  it('exposes damage relations as named-resource lists', async () => {
    const res = await getTypeByName('flying');

    const flying = assertContract(typeDetailSchema, res);
    expect(
      flying.damage_relations.double_damage_from.map((t) => t.name),
    ).toContain('rock');
    expect(
      flying.damage_relations.double_damage_to.map((t) => t.name),
    ).toContain('grass');
  });

  it('returns 200 for a valid type id (path identifier)', async () => {
    const res = await getTypeByName(3);

    const flying = assertContract(typeDetailSchema, res);
    expect(flying.name).toBe('flying');
  });
});

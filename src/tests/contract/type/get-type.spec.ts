import { assertContract } from '@api/assert-contract';
import { getTypeByName } from '@api/routes/type';
import { typeDetailSchema } from '@api/schemas/type.schema';

describe('[CONTRACT][TYPE] GET /type/{name}', () => {
  it('matches the detail contract', async () => {
    const res = await getTypeByName('flying');

    const body = assertContract(typeDetailSchema, res);

    expect(body.name).toBe('flying');
  });

  it('matches the contract when move_damage_class is null', async () => {
    // The `fairy` type has a null move_damage_class — exercises the
    // nullable field so a wrongly-required schema would fail here.
    const res = await getTypeByName('fairy');

    const body = assertContract(typeDetailSchema, res);

    expect(body.move_damage_class).toBeNull();
  });
});

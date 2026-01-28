import { Injectable, Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parse = require('parse/node');

@Injectable()
export class ParseService {
  private readonly logger = new Logger(ParseService.name);

  /**
   * Crée un nouvel objet Parse
   */
  createObject(className: string): Parse.Object {
    const ParseClass = Parse.Object.extend(className);
    return new ParseClass();
  }

  /**
   * Crée une nouvelle requête Parse
   */
  createQuery(className: string): Parse.Query {
    return new Parse.Query(className);
  }

  /**
   * Crée une requête OR combinant plusieurs requêtes
   */
  orQuery(queries: Parse.Query[]): Parse.Query {
    return Parse.Query.or(...queries);
  }

  /**
   * Sauvegarde un objet avec le master key
   */
  async saveWithMasterKey(obj: Parse.Object): Promise<Parse.Object> {
    return obj.save(null, { useMasterKey: true });
  }

  /**
   * Supprime un objet avec le master key
   */
  async destroyWithMasterKey(obj: Parse.Object): Promise<void> {
    await obj.destroy({ useMasterKey: true });
  }

  /**
   * Exécute une requête avec le master key
   */
  async findWithMasterKey<T extends Parse.Object>(
    query: Parse.Query<T>,
  ): Promise<T[]> {
    return query.find({ useMasterKey: true });
  }

  /**
   * Compte les résultats avec le master key
   */
  async countWithMasterKey<T extends Parse.Object>(
    query: Parse.Query<T>,
  ): Promise<number> {
    return query.count({ useMasterKey: true });
  }

  /**
   * Récupère le premier résultat avec le master key
   */
  async firstWithMasterKey<T extends Parse.Object>(
    query: Parse.Query<T>,
  ): Promise<T | undefined> {
    return query.first({ useMasterKey: true });
  }

  /**
   * Récupère un objet par ID avec le master key
   */
  async getByIdWithMasterKey<T extends Parse.Object>(
    className: string,
    objectId: string,
  ): Promise<T | null> {
    try {
      const query = new Parse.Query(className);
      return (await query.get(objectId, { useMasterKey: true })) as T;
    } catch (error: any) {
      if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Configure les ACL pour un objet
   */
  setPublicReadACL(obj: Parse.Object): void {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    acl.setRoleWriteAccess('admin', true);
    acl.setRoleReadAccess('admin', true);
    obj.setACL(acl);
  }

  /**
   * Configure les ACL pour un objet privé (propriétaire uniquement)
   */
  setOwnerACL(obj: Parse.Object, ownerId: string): void {
    const acl = new Parse.ACL();
    acl.setReadAccess(ownerId, true);
    acl.setWriteAccess(ownerId, true);
    acl.setRoleReadAccess('admin', true);
    acl.setRoleWriteAccess('admin', true);
    obj.setACL(acl);
  }

  /**
   * Crée ou récupère un rôle
   */
  async getOrCreateRole(roleName: string): Promise<Parse.Role> {
    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo('name', roleName);

    let role = await roleQuery.first({ useMasterKey: true });

    if (!role) {
      const roleACL = new Parse.ACL();
      roleACL.setPublicReadAccess(true);
      roleACL.setPublicWriteAccess(false);

      role = new Parse.Role(roleName, roleACL);
      await role.save(null, { useMasterKey: true });
      this.logger.log(`Role '${roleName}' créé avec succès`);
    }

    return role;
  }

  /**
   * Ajoute un utilisateur à un rôle
   */
  async addUserToRole(user: Parse.User, roleName: string): Promise<void> {
    const role = await this.getOrCreateRole(roleName);
    role.getUsers().add(user);
    await role.save(null, { useMasterKey: true });
  }
}

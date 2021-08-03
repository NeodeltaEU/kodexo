export enum DecoratorTypes {
  PROPERTY = 'property',
  STATIC_PROPERTY = 'static:property',
  METHOD = 'method',
  STATIC_METHOD = 'static:method',
  CLASS = 'class',
  PARAMETER = 'paramater',
  CONSTRUCTOR_PARAMETER = 'constructor:parameter',
  STATIC_PARAMETER = 'static:parameter'
}

/**
 *
 * @param args
 */
export function getDecoratorType(args: any[]): DecoratorTypes {
  const [target, propertyKey, descriptorOrIndex] = args

  const isParameter = typeof descriptorOrIndex === 'number'
  const isMethod = !!(descriptorOrIndex && descriptorOrIndex.value)
  const isProperty =
    !isParameter &&
    !isMethod &&
    ((propertyKey && descriptorOrIndex === undefined) || descriptorOrIndex)

  const isStatic = target === (target.prototype ? target : target.constructor)

  if (isMethod) {
    return isStatic ? DecoratorTypes.STATIC_METHOD : DecoratorTypes.METHOD
  }

  if (isProperty) {
    return isStatic ? DecoratorTypes.STATIC_PROPERTY : DecoratorTypes.PROPERTY
  }

  if (isParameter) {
    if (!propertyKey) return DecoratorTypes.CONSTRUCTOR_PARAMETER
    return isStatic ? DecoratorTypes.STATIC_PARAMETER : DecoratorTypes.PARAMETER
  }

  return DecoratorTypes.CLASS
}

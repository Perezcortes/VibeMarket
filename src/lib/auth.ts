import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Tipo para el usuario autenticado
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

/**
 * Clase de error personalizada para errores de autenticación
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Obtiene el usuario autenticado desde la sesión/token
 * NOTA: Esta es una implementación de ejemplo. En producción, debes:
 * - Usar NextAuth.js, Auth.js, o tu sistema de autenticación
 * - Validar JWT/tokens
 * - Verificar sesiones
 * 
 * Por ahora, simulamos obtener el userId desde headers
 * En tu implementación real, esto vendría de tu sistema de auth
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser> {
  // EJEMPLO: En producción, aquí validarías el token/sesión
  // const token = request.headers.get('authorization')?.replace('Bearer ', '');
  // const session = await validateToken(token);
  
  // Por ahora, obtenemos el user-id desde headers (solo para ejemplo)
 const userId =
  request.headers.get('x-user-id') ??
  process.env.DEV_USER_ID ??
  'test-seller-id';

  // Obtener usuario de la base de datos
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      full_name: true,
      role: true,
      is_active: true,
    },
  });

  if (!user) {
    throw new AuthError('Usuario no encontrado', 401);
  }

  if (!user.is_active) {
    throw new AuthError('Usuario inactivo. Contacta a soporte.', 403);
  }

  return user;
}

/**
 * Verifica que el usuario autenticado tenga el rol de vendedor
 * @param user - Usuario autenticado
 * @throws AuthError si el usuario no es vendedor
 */
export function requireSellerRole(user: AuthenticatedUser): void {
  if (user.role !== 'vendedor') {
    throw new AuthError(
      'Acceso denegado. Esta acción solo está disponible para vendedores.',
      403
    );
  }
}

/**
 * Verifica que el usuario autenticado tenga uno de los roles permitidos
 * @param user - Usuario autenticado
 * @param allowedRoles - Array de roles permitidos
 * @throws AuthError si el usuario no tiene ninguno de los roles permitidos
 */
export function requireRole(
  user: AuthenticatedUser,
  allowedRoles: string[]
): void {
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError(
      `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`,
      403
    );
  }
}

/**
 * Wrapper para manejar errores en las rutas API
 * Centraliza el manejo de errores y respuestas
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof AuthError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return Response.json(
    { error: 'Error interno del servidor' },
    { status: 500 }
  );
}
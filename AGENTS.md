# language-trainer — contexto

- Lee primero `docs/context/R2_PROJECT_CONTEXT.md`: es el contexto operativo principal.
- Consulta el resto de documentación selectivamente según la tarea; reutiliza lo ya conocido.
- No releas `docs/research/` completo salvo necesidad explícita por una decisión global pedagógica o curricular.
- Proporciona a los subagentes contexto mínimo y referencias concretas; no les encargues lecturas completas por defecto.

## Regla permanente de publicación

Language Trainer se utiliza normalmente desde **https://sergiopf93.github.io/language-trainer/**. `origin/main` representa la versión estable. Localhost es únicamente un entorno de desarrollo y pruebas.

Una funcionalidad se entrega cuando está integrada en la versión estable, publicada en GitHub Pages y comprobada desde la URL pública. Un build local o un workflow exitoso no son suficientes. Mantener compatibilidad con la subruta de Pages, navegación, persistencia y PWA; no cambiar el entorno habitual de publicación sin autorización del usuario. Cloudflare se conserva como despliegue existente; no redesplegarlo por cambios de Pages.

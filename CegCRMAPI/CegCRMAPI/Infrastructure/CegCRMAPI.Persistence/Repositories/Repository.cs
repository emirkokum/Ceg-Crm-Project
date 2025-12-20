using CegCRMAPI.Domain.Entities.Common;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CegCRMAPI.Persistence.Repositories
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly CegCrmDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(CegCrmDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Where(x => x.Id == id && x.DeletedDate == null).FirstOrDefaultAsync(cancellationToken);  
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet.Where(x => x.DeletedDate == null).ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Where(x => x.DeletedDate == null).Where(expression).ToListAsync(cancellationToken);
        }

        public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            entity.CreatedDate = DateTime.UtcNow;
            await _dbSet.AddAsync(entity, cancellationToken);
        }

        public async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            foreach (var entity in entities)
            {
                entity.CreatedDate = DateTime.UtcNow;;
            }
            await _dbSet.AddRangeAsync(entities, cancellationToken);
        }

        public void Update(T entity)
        {
            entity.UpdatedDate = DateTime.UtcNow;
            _dbSet.Update(entity);
        }

        public void Remove(T entity)    
        {
            entity.DeletedDate = DateTime.UtcNow;
            _dbSet.Update(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)    
        {
            _dbSet.RemoveRange(entities);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
        {
            return await _dbSet.AnyAsync(expression, cancellationToken);
        }

        public async Task<int> CountAsync(Expression<Func<T, bool>> expression, CancellationToken cancellationToken = default)
        {
            return await _dbSet.CountAsync(expression, cancellationToken);
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
        public IQueryable<T> Query()
        {
            return _dbSet.Where(x => x.DeletedDate == null).AsQueryable();
        }
        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, bool tracking = false)
        {
            var query = tracking ? _dbSet.Where(x => x.DeletedDate == null) : _dbSet.Where(x => x.DeletedDate == null).AsNoTracking();
            return await query.FirstOrDefaultAsync(predicate);
        }

    }
} 
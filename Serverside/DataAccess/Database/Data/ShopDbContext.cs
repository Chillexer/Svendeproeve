using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Data
{
    public class ShopDbContext : DbContext
    {
        public ShopDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<InventoryInfo> InventoryInfos { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Variant> Variants { get; set; }
        public DbSet<VariantOrder> VariantOrders { get; set; }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //InventoryInfo
            modelBuilder.Entity<InventoryInfo>().HasKey(i => new { i.VariantId, i.SizeId });
            modelBuilder.Entity<InventoryInfo>().Navigation(i => i.Variant).AutoInclude();
            modelBuilder.Entity<InventoryInfo>().Navigation(i => i.Size).AutoInclude();

            //Product
            modelBuilder.Entity<Product>().Navigation(p => p.Gender).AutoInclude();
            modelBuilder.Entity<Product>().Navigation(p => p.Categories).AutoInclude();
            modelBuilder.Entity<Product>().Property(p => p.SizeType).HasConversion<int>();

            //Variant
            modelBuilder.Entity<Variant>().Navigation(v => v.Colors).AutoInclude();
            modelBuilder.Entity<Variant>().Navigation(v => v.InventoryInfos).AutoInclude();

            //Order
            modelBuilder.Entity<Order>().Navigation(o => o.VariantOrders).AutoInclude();
            modelBuilder.Entity<Order>().Property(s => s.Status).HasConversion<int>();


            //VariantOrder
            modelBuilder.Entity<VariantOrder>().Navigation(v => v.Variant).AutoInclude();

            //Size
            modelBuilder.Entity<Size>().Property(s => s.SizeType).HasConversion<int>();
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {
                var now = DateTime.UtcNow; // current datetime

                if (entity.State == EntityState.Added)
                {
                    ((BaseEntity)entity.Entity).CreatedAt = now;
                }
                ((BaseEntity)entity.Entity).UpdatedAt = now;
            }
        }

    }
}

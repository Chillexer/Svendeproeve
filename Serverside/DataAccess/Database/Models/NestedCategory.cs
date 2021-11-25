using System.Collections.Generic;

namespace FNO.DataAccess.Database.Models
{
    public class NestedCategory
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; }
        public List<NestedCategory> ChildCategories { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [Route("/")]
    public class ItemController : Controller
    {
        private readonly ItemContext _context;

        // 1 page = 5 item
        private readonly int pageLength = 2;

        public ItemController(ItemContext context)
        {
            _context = context;

            if(_context.Items.Count() == 0)
            {
                _context.Items.Add(new Item { Manufacturer = "Intel", Type = "CPU", Name = "Intel Core i5 8600K 3.6GHz", Price = 81990 });
                _context.Items.Add(new Item { Manufacturer = "Intel", Type = "CPU", Name = "Intel Core i7 8700K 3.7GHz", Price = 115710 });
                _context.Items.Add(new Item { Manufacturer = "Gigabyte", Type = "VGA", Name = "GeForce GTX1050 Ti 4GB Gigabyte GV-N105TOC-4GD ", Price = 63950 });
                _context.Items.Add(new Item { Manufacturer = "ASUS", Type = "VGA", Name = "GeForce GTX1080 8GB ASUS ROG-POSEIDON-GTX1080TI-P11G-GAMING", Price = 305880 });

                _context.SaveChanges();
            }
        }

        private List<Item> filterList(string type, string name, string manufacturer, int? minprice, int? maxprice)
        {
            // get the list of items
            var list = _context.Items.ToList();

            // filter by type, non case sensitive
            if (type != null)
            {
                list = list.Where(i => i.Type.ToUpper().Contains(type.ToUpper())).ToList();
            }

            // filter by name, non case sensitive
            if (name != null)
            {
                list = list.Where(i => i.Name.ToUpper().Contains(name.ToUpper())).ToList();
            }

            // filter by manufacturer, non case sensitive
            if (manufacturer != null)
            {
                list = list.Where(i => i.Manufacturer.ToUpper().Contains(manufacturer.ToUpper())).ToList();
            }

            // filter by minprice
            if (minprice != null)
            {
                list = list.Where(i => i.Price >= minprice).ToList();
            }

            // filter by maxprice
            if (maxprice != null)
            {
                list = list.Where(i => i.Price <= maxprice).ToList();
            }

            return list;
        }

        // GET: /
        [HttpGet]
        public IEnumerable<Item> Get([FromQuery] string type, [FromQuery] int? page, [FromQuery] string name, [FromQuery] string manufacturer, [FromQuery] int? minprice, [FromQuery] int? maxprice)
        {
            // get the list of items
            var list = filterList(type, name, manufacturer, minprice, maxprice);
            
            // pagination, starts from 1
            if (page == null || page < 1) page = 1;
            list = list.Skip(((int)page - 1) * pageLength).Take(pageLength).ToList();

            return list;
        }

        // GET /{id}
        [HttpGet("{id}", Name = "GetItem")]
        public IActionResult Get(int id)
        {
            var item = _context.Items.FirstOrDefault(i => i.Id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        // POST /
        [HttpPost]
        public IActionResult Post([FromBody] Item item)
        {
            if(item == null)
            {
                return BadRequest();
            }
            _context.Items.Add(item);
            _context.SaveChanges();

            return CreatedAtRoute("GetItem", new { id = item.Id }, item);
        }

        // PUT /{id}
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody]Item item)
        {
            if (item == null || item.Id != id)
            {
                return BadRequest();
            }

            var dbItem = _context.Items.FirstOrDefault(i => i.Id == id);
            if(dbItem == null)
            {
                return NotFound();
            }

            dbItem.Manufacturer = item.Manufacturer;
            dbItem.Name = item.Name;
            dbItem.Price = item.Price;
            dbItem.Type = item.Type;
            dbItem.Extras = item.Extras;

            _context.Items.Update(dbItem);
            _context.SaveChanges();
            return new NoContentResult();
        }

        // DELETE /{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Items.FirstOrDefault(i => i.Id == id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            _context.SaveChanges();
            return new NoContentResult();
        }

        // GET: /pages/{type}
        [HttpGet("/pages")]
        public int GetPages([FromQuery] string type, [FromQuery] string name, [FromQuery] string manufacturer, [FromQuery] int? minprice, [FromQuery] int? maxprice)
        {
            var list = filterList(type, name, manufacturer, minprice, maxprice);
            return Convert.ToInt32(Math.Ceiling((double)list.Count() / pageLength));
        }

        // GET: /manufacturers
        [HttpGet("/manufacturers")]
        public IEnumerable<string> GetManufacturers([FromQuery] string type, [FromQuery] string name, [FromQuery] string manufacturer, [FromQuery] int? minprice, [FromQuery] int? maxprice)
        {
            var list = filterList(type, name, manufacturer, minprice, maxprice);
            return list.Select(i => i.Manufacturer).Distinct().ToList();
        }
    }
}

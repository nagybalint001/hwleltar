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
        // GET: /
        [HttpGet]
        public IEnumerable<Item> Get()
        {
            //TODO use query params as filter
            return _context.Items.ToList();
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
    }
}

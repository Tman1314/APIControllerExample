using ResoIndex.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ResoIndex.Controllers
{
    [EnableCors(origins: "http://localhost:5500", headers: "*", methods: "*")]
    public class ResolutionsController : ApiController
    {
        public HttpResponseMessage Get()
        {
            using (ResolutionDBContext dbContext = new ResolutionDBContext())
            {
                var Resolutions =  dbContext.MasterLists.ToList();
                return Request.CreateResponse(HttpStatusCode.OK, Resolutions);
            }
        }

        public HttpResponseMessage Get(string id)
        {
            using (ResolutionDBContext dbContext = new ResolutionDBContext())
            {
                var entity =  dbContext.MasterLists.FirstOrDefault(e => e.ResoNum == id);
                if (entity != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, entity);
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound,
                        "Resolution with number " + id.ToString() + " not found");
                }
            }
        }

        public HttpResponseMessage Post([FromBody] MasterList masterList)
        {
            try
            {
                using (ResolutionDBContext dbContext = new ResolutionDBContext())
                {
                    dbContext.MasterLists.Add(masterList);
                    dbContext.SaveChanges();
                    var message = Request.CreateResponse(HttpStatusCode.Created, masterList);
                    message.Headers.Location = new Uri(Request.RequestUri + "/" + masterList.ID.ToString());
                    return message;
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        public HttpResponseMessage Put(string id, [FromBody] MasterList masterList)
        {
            try
            {
                using (ResolutionDBContext dbContext = new ResolutionDBContext())
                {
                    var entity = dbContext.MasterLists.FirstOrDefault(e => e.ResoNum == id);
                    if (entity == null)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            "Resolution with number " + id.ToString() + " not found to update");
                    }
                    else
                    {
                        entity.ResoNum = masterList.ResoNum;
                        entity.SupercedesResoNum = masterList.SupercedesResoNum;
                        entity.Description = masterList.Description;
                        entity.GeneralCategory = masterList.GeneralCategory;
                        entity.Date = masterList.Date;
                        entity.SupercededByResoNum = masterList.SupercededByResoNum;
                        dbContext.SaveChanges();
                        return Request.CreateResponse(HttpStatusCode.OK, entity);
                    }
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        public HttpResponseMessage Delete(string id)
        {
            try
            {
                using (ResolutionDBContext dbContext = new ResolutionDBContext())
                {
                    var entity = dbContext.MasterLists.FirstOrDefault(e => e.ResoNum == id);
                    if (entity == null)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            "Resolution with number = " + id.ToString() + " not found to delete");
                    }
                    else
                    {
                        dbContext.MasterLists.Remove(entity);
                        dbContext.SaveChanges();
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }
    }
}

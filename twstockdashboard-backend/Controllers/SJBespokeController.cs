using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace twstockdashboard_backend.Controllers
{
    [ApiController]

    [Route("api/[controller]")]
    public class _sampleController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<String> Get()
        {
            return new string[] { "hello world" };
        }
    }

    //=================================================================

    [Route("api/[controller]")]
    public class apiNavBarController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new SJ().NavBar());
        }
    }


    [Route("api/[controller]")]
    public class apiApexChartsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().ApexCharts(60)); }
    }


    [Route("api/[controller]")]
    public class apiTicksController : ControllerBase
    {
        [HttpGet("逐筆明細")]
        public IActionResult Get()
        {
            var res = new SJ().Ticks(30);
            if (res == null || res.Count == 0)
            {
                return BadRequest();
            }
            else return Ok(res);
        }
    }


    [Route("api/[controller]")]
    public class apiOptionsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().Options("TX2", "202404", "9")); }
    }


    [Route("api/[controller]")]
    public class apiGetPositionsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().GetPositions()); }
    }


    [Route("api/[controller]")]
    public class apiStocksTable_TW30Controller : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().StocksTable("TW30")); }
    }


    [Route("api/[controller]")]
    public class apiStocksTable_WatachlistController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().StocksTable("")); }
    }


    [Route("api/[controller]")]
    public class apiApexChartsOHLC_TENNController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().ApexChartsOHLC("TENN")); }
    }


    [Route("api/[controller]")]
    public class apiApexChartsOHLC_TFNNController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().ApexChartsOHLC("TFNN")); }
    }


    [Route("api/[controller]")]
    public class apiApexChartsOHLC_XINNController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().ApexChartsOHLC("XINN")); }
    }


    [Route("api/[controller]")]
    public class apiApexChartsOHLC_PctChgController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new SJ().ApexChartsOHLC("")); }
    }
}
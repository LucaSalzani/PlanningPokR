using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Server.Services;

namespace Server.UnitTest
{
    [TestClass]
    public class DummyTest
    {
        [TestMethod]
        public void DummyTest_WhenTrue_ShouldBeTrue()
        {
            var test = true;
            Assert.IsTrue(test);
        }
    }
}

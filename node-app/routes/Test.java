public class Test{
public static void test(int num){
	char[] charArr=new char[num];
	try {
		Thread.sleep(5* 1000);
			} catch (InterruptedException e) {
						System.out.println("ERROR");
					}

	}
	public static void main(String args[]){
	Runtime r = Runtime.getRuntime();
	long mem=r.freeMemory();
	int range=1024*1024*10;
	println("当前内存情况:"+mem);
	println("#############test开始###############");
	println("第一次内存申请");
	test(range);//第一次内存申请1024*1024
	println("当前内存情况:"+r.freeMemory()+"使用了内存:"+(mem-r.freeMemory()));
	mem=r.freeMemory();
	println("第一次内存释放完毕");

	println("当前内存情况:"+r.freeMemory());
	
	println("第二次内存申请");
	test(range*2);//第二次内存申请1024*1024*10
	println("当前内存情况:"+r.freeMemory()+"使用了内存:"+(mem-r.freeMemory()));
	mem=r.freeMemory();
	println("第二次内存释放完毕");

	println("当前内存情况:"+r.freeMemory());

	println("第三次内存申请");
	test(range/2);//第三次内存申请1024*1024/2
	println("当前内存情况:"+r.freeMemory()+"使用了内存:"+(mem-r.freeMemory()));
	mem=r.freeMemory();
	println("第三次内存释放完毕");

	println("当前内存情况:"+r.freeMemory());

System.gc();
		try {
		Thread.sleep(100* 1000);
			} catch (InterruptedException e) {
						System.out.println("ERROR");
					}
	}
public static void println(String s){
	System.out.println(s);
}
}
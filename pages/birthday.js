import Image from "next/image";

export default function Birthday() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3 className="text-center text-light my-5">
            <strong>Tap to open your present</strong>
          </h3>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          <div className="box">
            <div className="box-body">
              <div className="img" height={150} width={150}>
                <Image src="/bibs.png" alt="bibs" height={150} width={150} />
              </div>
              <div className="box-lid">
                <div className="box-bowtie"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

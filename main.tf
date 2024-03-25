provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "zbd" {
  name_prefix = "zbd"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "zbd" {
  ami           = "ami-006dcf34c09e50022" // Amazon Linux 2 AMI
  instance_type = "t2.micro"
  key_name      = "zbd"
  vpc_security_group_ids = [
    aws_security_group.zbd.id,
  ]
  user_data = <<-EOF
              #!/bin/bash
              sudo yum -y update
              sudo yum install -y git
              sudo yum install -y docker
              sudo systemctl enable docker
              sudo systemctl start docker
              sudo curl -L "https://github.com/docker/compose/releases/download/v2.26.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
              sudo chown $USER /var/run/docker.sock
              EOF
}

output "public_ip" {
  value = aws_instance.zbd.public_ip
}

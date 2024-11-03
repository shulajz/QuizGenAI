"""Updated models to include time_taken, attempt_date, and average_score/best_score properties

Revision ID: 1f524e247581
Revises: 
Create Date: 2024-11-01 10:13:55.209056

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1f524e247581'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('results', schema=None) as batch_op:
        batch_op.add_column(sa.Column('attempt_date', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('time_taken', sa.Integer(), nullable=False))
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('results', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.drop_column('time_taken')
        batch_op.drop_column('attempt_date')

    # ### end Alembic commands ###